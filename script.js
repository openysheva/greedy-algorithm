function sortDevicesData (obj) {
  let { devices } = obj;

  devices.sort(function (a, b) {
    const isEqual = a.duration === b.duration;
    if (a.duration > b.duration || (isEqual && a.power > b.power)) {
      return -1;
    }

    if (a.duration < b.duration || (isEqual && a.power < b.power))  {
      return 1;
    }

    return 0;
  });

  return devices;
}

function getRates (obj) {
  let { rates, maxPower } = obj;
  let schedule = [];

  for (let ratesIndex = 0; ratesIndex < rates.length; ratesIndex++) {
    if (rates[ratesIndex].from < rates[ratesIndex].to) {
      for (let periodIndex = rates[ratesIndex].from; periodIndex < rates[ratesIndex].to; periodIndex++) {
        schedule[periodIndex] = {'time': periodIndex, 'cost': rates[ratesIndex].value, 'currentPower': maxPower, 'id': []};
      }
    } else {
      for (let periodIndex = rates[ratesIndex].from; periodIndex < 24; periodIndex++) {
        schedule[periodIndex] = {'time': periodIndex, 'cost': rates[ratesIndex].value, 'currentPower': maxPower, 'id': []};
      }
      for (let periodIndex = rates[ratesIndex].to - 1; periodIndex >= 0; periodIndex--) {
        schedule[periodIndex] = {'time': periodIndex, 'cost': rates[ratesIndex].value, 'currentPower': maxPower, 'id': []};
      }
    }
  }

  return schedule;
}

function setMode (array) {
  for (let index = 0; index < array.length; index++) {
    if (index >= 7 && index < 21) {
      array[index].mode = 'day';
    } else {
      array[index].mode = 'night';
    }
  }

  return array;
}

function filterRatesByMode(array, mode) {
  if (!mode) return array;

  let filteredArray = array.filter(item => item.mode == mode);

  if (mode === 'night') {
    return [...filteredArray.slice(7, filteredArray.length), ...filteredArray.slice(0, 7)];
  }

  return filteredArray;
}

function findMinCost(array, filteredArray, device) {
  let minCost, minTime;

  if (filteredArray.length < device.duration) {
    throw new Error('Продолжительность работы устройства превышает продолжительность периода');
  }

  const isFullDay = filteredArray.length !== 24;
  const findToIndex = isFullDay ? filteredArray.length - device.duration + 1 : filteredArray.length;

  outer: for (let arrayIndex = 0; arrayIndex < findToIndex; arrayIndex++) {
    let currentCost = 0;

    for (let durationIndex = arrayIndex; durationIndex < arrayIndex + device.duration; durationIndex++) {
      let correctIndex = durationIndex > 23 && !isFullDay ? durationIndex % 24 : durationIndex;
      let timeInCommonArray = filteredArray[correctIndex].time;

      if (array[timeInCommonArray].currentPower >= device.power) {
        currentCost += device.power / 1000 * filteredArray[correctIndex].cost;
      } else continue outer;
    }

    if (!minCost || currentCost < minCost) {
      minCost = currentCost;
      minTime = filteredArray[arrayIndex].time;
    }
  }

  device.bestCost = Math.round(minCost * 10000) / 10000;

  for (let timeIndex = minTime; timeIndex < minTime + device.duration; timeIndex++) {
    array[timeIndex > 23 ? timeIndex % 24 : timeIndex].id.push(device.id);
    array[timeIndex > 23 ? timeIndex % 24 : timeIndex].currentPower -= device.power;
  }
}

function setOutput(devicesWithCost, filledArray) {
  let outputObject = {};
  let allDevicesSum = 0;

  outputObject.schedule = {};
  outputObject.consumedEnergy = {};
  outputObject.consumedEnergy.devices = {};

  for (let filledArrayIndex = 0; filledArrayIndex < filledArray.length; filledArrayIndex++) {
    outputObject.schedule[filledArrayIndex] = filledArray[filledArrayIndex].id;
  }

  for (let devicesIndex = 0; devicesIndex < devicesWithCost.length; devicesIndex++) {
    outputObject.consumedEnergy.devices[devicesWithCost[devicesIndex].id] = devicesWithCost[devicesIndex].bestCost;
    allDevicesSum += devicesWithCost[devicesIndex].bestCost;
  }

  outputObject.consumedEnergy.value = allDevicesSum;

  return outputObject;
}

function distributeDevices(InputObject) {
  try {
    let devices = sortDevicesData(InputObject);
    let dataArray = setMode(getRates(InputObject));
    let filledArray;

    for (let deviceIndex = 0; deviceIndex < devices.length; deviceIndex++) {
      let filteredArray = filterRatesByMode(dataArray, devices[deviceIndex].mode);
      findMinCost(dataArray, filteredArray, devices[deviceIndex]);
    }
    return setOutput(devices, dataArray);
  } catch (error) {
    console.log(error);
  }
}

console.log(distributeDevices(
{
  "devices": [
      {
          "id": "F972B82BA56A70CC579945773B6866FB",
          "name": "Посудомоечная машина",
          "power": 950,
          "duration": 3,
          "mode": "night"
      },
      {
          "id": "C515D887EDBBE669B2FDAC62F571E9E9",
          "name": "Духовка",
          "power": 2000,
          "duration": 2,
          "mode": "day"
      },
      {
          "id": "02DDD23A85DADDD71198305330CC386D",
          "name": "Холодильник",
          "power": 50,
          "duration": 24
      },
      {
          "id": "1E6276CC231716FE8EE8BC908486D41E",
          "name": "Термостат",
          "power": 50,
          "duration": 24
      },
      {
          "id": "7D9DC84AD110500D284B33C82FE6E85E",
          "name": "Кондиционер",
          "power": 850,
          "duration": 1
      }
  ],
  "rates": [
      {
          "from": 7,
          "to": 10,
          "value": 6.46
      },
      {
          "from": 10,
          "to": 17,
          "value": 5.38
      },
      {
          "from": 17,
          "to": 21,
          "value": 6.46
      },
      {
          "from": 21,
          "to": 23,
          "value": 5.38
      },
      {
          "from": 23,
          "to": 7,
          "value": 1.79
      }
  ],
  "maxPower": 2100
}));
