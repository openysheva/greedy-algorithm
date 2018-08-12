const assert = chai.assert;
const expect = chai.expect;

describe("алгоритм распределения работы устройств по ценовым зонам с минимальной стоимостью", function() {
  describe("sortDevicesData", function() {
    it("сортирует массив устройств по циклу работы", function() {
      const data = {
        "devices": [{
            "id": 1,
            "power": 400,
            "duration": 5,
          },
          {
            "id": 2,
            "power": 200,
            "duration": 14,
          },
          {
            "id": 3,
            "power": 900,
            "duration": 1,
          },
          {
            "id": 4,
            "power": 500,
            "duration": 9,
          },
          {
            "id": 5,
            "power": 400,
            "duration": 3,
          }
        ]
      }
      const result = sortDevicesData(data);

      assert.equal(result[0].id, 2);
      assert.equal(result[1].id, 4);
      assert.equal(result[2].id, 1);
      assert.equal(result[3].id, 5);
      assert.equal(result[4].id, 3);
    });

    it("сортирует массив по мощности, если равные циклы работы", function() {
      const data = {
        "devices": [{
            "id": 1,
            "power": 400,
            "duration": 1,
          },
          {
            "id": 2,
            "power": 200,
            "duration": 14,
          },
          {
            "id": 3,
            "power": 900,
            "duration": 14,
          },
          {
            "id": 4,
            "power": 100,
            "duration": 16,
          },

        ]
      };

      const result = sortDevicesData(data);

      assert.equal(result[0].id, 4);
      assert.equal(result[1].id, 3);
      assert.equal(result[2].id, 2);
      assert.equal(result[3].id, 1);
    });

    it("не сортирует уже отсортированный массив", function() {
      const data = {
        "devices": [{
            "id": 1,
            "power": 400,
            "duration": 12,
          },
          {
            "id": 2,
            "power": 200,
            "duration": 11,
          },
          {
            "id": 3,
            "power": 900,
            "duration": 10,
          },
        ]
      };

      const result = sortDevicesData(data);

      assert.equal(result[0].id, 1);
      assert.equal(result[1].id, 2);
      assert.equal(result[2].id, 3);
    });
  });

  describe("getRates", function() {
    it("заполняет массив ценовыми зонами внутри суток", function() {
      const data = {
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
        ],
        "maxPower": 2100,
      };

      const result = getRates(data);

      const expectData7 = {
        'time': 7,
        'cost': 6.46,
        'currentPower': 2100,
        'id': []
      };

      const expectData16 = {
        'time': 16,
        'cost': 5.38,
        'currentPower': 2100,
        'id': []
      };

      expect(result[7]).to.deep.equal(expectData7);
    });

    it("заполняет массив ценовой зоной с переходом через сутки", function() {
      const data = {
        "rates": [
            {
                "from": 23,
                "to": 5,
                "value": 6.46
            },
        ],
        "maxPower": 2100,
      };

      const result = getRates(data);

      const expectDataFor23 = {
        'time': 23,
        'cost': 6.46,
        'currentPower': 2100,
        'id': []
      };
      const expectDataFor0 = {
        'time': 0,
        'cost': 6.46,
        'currentPower': 2100,
        'id': []
      };
      const expectDataFor4 = {
        'time': 4,
        'cost': 6.46,
        'currentPower': 2100,
        'id': []
      };

      expect(result[23]).to.deep.equal(expectDataFor23);
      expect(result[0]).to.deep.equal(expectDataFor0);
      expect(result[4]).to.deep.equal(expectDataFor4);
    });

    it("заполняет массив ценовыми зонами внутри и с переходом через сутки", function() {
      const data = {
        "rates": [
            {
                "from": 23,
                "to": 5,
                "value": 6.46
            },
            {
                "from": 5,
                "to": 13,
                "value": 5.38
            },
        ],
        "maxPower": 2100,
      };

      const result = getRates(data);

      const expectDataFor23 = {
        'time': 23,
        'cost': 6.46,
        'currentPower': 2100,
        'id': []
      };
      const expectDataFor0 = {
        'time': 0,
        'cost': 6.46,
        'currentPower': 2100,
        'id': []
      };
      const expectDataFor5 = {
        'time': 5,
        'cost': 5.38,
        'currentPower': 2100,
        'id': []
      };
      const expectDataFor12 = {
        'time': 12,
        'cost': 5.38,
        'currentPower': 2100,
        'id': []
      };

      expect(result[23]).to.deep.equal(expectDataFor23);
      expect(result[0]).to.deep.equal(expectDataFor0);
      expect(result[5]).to.deep.equal(expectDataFor5);
      expect(result[12]).to.deep.equal(expectDataFor12);
    });
  });

  describe("setMode", function() {
    it("устанавливает ночной режим", function() {
      const data = [
        {
          'time': 0,
          'cost': 1.79,
          'currentPower': 2100,
          'id': []
        },
        {
          'time': 1,
          'cost': 1.79,
          'currentPower': 2100,
          'id': []
        },
        {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}
      ];

      const result = setMode(data);

      const expectDataFor0 = {
        'time': 0,
        'cost': 1.79,
        'currentPower': 2100,
        'id': [],
        'mode': 'night'
      };

      const expectDataFor1 = {
        'time': 1,
        'cost': 1.79,
        'currentPower': 2100,
        'id': [],
        'mode': 'night'
      };

      expect(result[0]).to.deep.equal(expectDataFor0);
      expect(result[1]).to.deep.equal(expectDataFor1);
    });

    it("устанавливает дневные часы", function() {
      const data = [
        {},{},{},{},{},{},{},
        {
          'time': 7,
          'cost': 6.46,
          'currentPower': 2100,
          'id': []
        },
        {
          'time': 8,
          'cost': 6.46,
          'currentPower': 2100,
          'id': []
        },
        {},{},{},{},{},{},{},{},{},{},{},{},{},{},{}
      ];

      const result = setMode(data);

      const expectDataFor7 = {
        'time': 7,
        'cost': 6.46,
        'currentPower': 2100,
        'id': [],
        'mode': 'day'
      };

      const expectDataFor8 = {
        'time': 8,
        'cost': 6.46,
        'currentPower': 2100,
        'id': [],
        'mode': 'day'
      };

      expect(result[7]).to.deep.equal(expectDataFor7);
      expect(result[8]).to.deep.equal(expectDataFor8);
    });

    it("устанавливает ночные и дневные часы", function() {
      const data = [
        {
          'time': 0,
          'cost': 1.79,
          'currentPower': 2100,
          'id': []
        },
        {},{},{},{},{},{},{},
        {
          'time': 8,
          'cost': 6.46,
          'currentPower': 2100,
          'id': []
        },
        {},{},{},{},{},{},{},{},{},{},{},{},{},{},{}
      ];

      const result = setMode(data);

      const expectDataFor0 = {
        'time': 0,
        'cost': 1.79,
        'currentPower': 2100,
        'id': [],
        'mode': 'night'
      };

      const expectDataFor8 = {
        'time': 8,
        'cost': 6.46,
        'currentPower': 2100,
        'id': [],
        'mode': 'day'
      };

      expect(result[0]).to.deep.equal(expectDataFor0);
      expect(result[8]).to.deep.equal(expectDataFor8);
    });
  });

  describe("filterRatesByMode", function() {
    it("фильтрует по ночной зоне", function() {
      const data = [
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"}
      ];

      const result = filterRatesByMode(data, "night");

      const expectedData = [
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
      ];

      expect(result).to.deep.equal(expectedData);
    });

    it("фильтрует по дневной зоне", function() {
      const data = [
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"}
      ];

      const result = filterRatesByMode(data, "day");

      const expectedData = [
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
      ];

      expect(result).to.deep.equal(expectedData);
    });

    it("не фильтрует при отсутствии второго аргумента", function() {
      const data = [
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"}
      ];

      const result = filterRatesByMode(data);

      const expectedData = [
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"day"},
        {"mode":"night"},
        {"mode":"night"},
        {"mode":"night"}
      ];

      expect(result).to.deep.equal(expectedData);
    });
  });

  describe("distributeDevices", function() {
    it("распределяет устройства и считает суммы ночью", function() {
      const data = {
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
                "mode": "night"
            },
            {
                "id": "02DDD23A85DADDD71198305330CC386D",
                "name": "Холодильник",
                "power": 250,
                "duration": 2,
                "mode": "night"
            },
            {
                "id": "1E6276CC231716FE8EE8BC908486D41E",
                "name": "Термостат",
                "power": 950,
                "duration": 4,
                "mode": "night"
            },
            {
                "id": "7D9DC84AD110500D284B33C82FE6E85E",
                "name": "Кондиционер",
                "power": 650,
                "duration": 7,
                "mode": "night"
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
      };

      const result = distributeDevices(data);

      assert.equal(result.consumedEnergy.value, 42.463);

      const expectedData = {
        '1E6276CC231716FE8EE8BC908486D41E': 6.802,
        '02DDD23A85DADDD71198305330CC386D': 0.895,
        '7D9DC84AD110500D284B33C82FE6E85E': 8.1445,
        'C515D887EDBBE669B2FDAC62F571E9E9': 21.52,
        'F972B82BA56A70CC579945773B6866FB': 5.1015
      }

      expect(result.consumedEnergy.devices).to.deep.equal(expectedData);
    });

    it("распределяет устройства и считает суммы днем", function() {
      const data = {
        "devices": [
            {
                "id": "F972B82BA56A70CC579945773B6866FB",
                "name": "Посудомоечная машина",
                "power": 950,
                "duration": 3,
                "mode": "day"
            },
            {
                "id": "C515D887EDBBE669B2FDAC62F571E9E9",
                "name": "Духовка",
                "power": 1000,
                "duration": 2,
                "mode": "day"
            },
            {
                "id": "02DDD23A85DADDD71198305330CC386D",
                "name": "Холодильник",
                "power": 250,
                "duration": 2,
                "mode": "day"
            },
            {
                "id": "1E6276CC231716FE8EE8BC908486D41E",
                "name": "Термостат",
                "power": 950,
                "duration": 4,
                "mode": "day"
            },
            {
                "id": "7D9DC84AD110500D284B33C82FE6E85E",
                "name": "Кондиционер",
                "power": 550,
                "duration": 14,
                "mode": "day"
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
      }

      const result = distributeDevices(data);

      assert.equal(result.consumedEnergy.value, 96.971);

      const expectedData = {
        '1E6276CC231716FE8EE8BC908486D41E': 20.444,
        '02DDD23A85DADDD71198305330CC386D': 2.69,
        '7D9DC84AD110500D284B33C82FE6E85E': 45.584,
        'C515D887EDBBE669B2FDAC62F571E9E9': 12.92,
        'F972B82BA56A70CC579945773B6866FB': 15.333
      }

      expect(result.consumedEnergy.devices).to.deep.equal(expectedData);
    });

    it("распределяет устройства и считает суммы при одинаковой продолжительности работы", function() {
      const data = {
        "devices": [
            {
                "id": "F972B82BA56A70CC579945773B6866FB",
                "name": "Посудомоечная машина",
                "power": 950,
                "duration": 4,
                "mode": "day"
            },
            {
                "id": "C515D887EDBBE669B2FDAC62F571E9E9",
                "name": "Духовка",
                "power": 2000,
                "duration": 4,
                "mode": "day"
            },
            {
                "id": "02DDD23A85DADDD71198305330CC386D",
                "name": "Холодильник",
                "power": 250,
                "duration": 4,
                "mode": "night"
            },
            {
                "id": "1E6276CC231716FE8EE8BC908486D41E",
                "name": "Термостат",
                "power": 950,
                "duration": 4,
                "mode": "night"
            },
            {
                "id": "7D9DC84AD110500D284B33C82FE6E85E",
                "name": "Кондиционер",
                "power": 550,
                "duration": 4,
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
      };

      const result = distributeDevices(data);

      assert.equal(result.consumedEnergy.value, 77.03999999999999);

      const expectedData = {
        'C515D887EDBBE669B2FDAC62F571E9E9': 43.04,
        'F972B82BA56A70CC579945773B6866FB': 21.47,
        '1E6276CC231716FE8EE8BC908486D41E': 6.802,
        '7D9DC84AD110500D284B33C82FE6E85E': 3.938,
        '02DDD23A85DADDD71198305330CC386D': 1.79
      };

      expect(result.consumedEnergy.devices).to.deep.equal(expectedData);
    });

    it("распределяет устройства и считает суммы при одинаковой продолжительности и мощности", function() {
      const data = {
        "devices": [
            {
                "id": "F972B82BA56A70CC579945773B6866FB",
                "name": "Посудомоечная машина",
                "power": 2000,
                "duration": 2,
                "mode": "day"
            },
            {
                "id": "C515D887EDBBE669B2FDAC62F571E9E9",
                "name": "Духовка",
                "power": 2000,
                "duration": 2,
                "mode": "day"
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
      }

      const result = distributeDevices(data);

      assert.equal(result.consumedEnergy.value, 43.04);

      const expectedData = {
        'F972B82BA56A70CC579945773B6866FB': 21.52,
        'C515D887EDBBE669B2FDAC62F571E9E9': 21.52,
      };

      expect(result.consumedEnergy.devices).to.deep.equal(expectedData);
    });

    it("распределяет устройства и считает суммы в измененных ценовых зонах", function() {
      const data = {
        "devices": [
            {
                "id": "F972B82BA56A70CC579945773B6866FB",
                "name": "Посудомоечная машина",
                "power": 950,
                "duration": 3,
                "mode": "day"
            },
            {
                "id": "C515D887EDBBE669B2FDAC62F571E9E9",
                "name": "Духовка",
                "power": 1500,
                "duration": 2,
                "mode": "day"
            },
            {
                "id": "02DDD23A85DADDD71198305330CC386D",
                "name": "Холодильник",
                "power": 250,
                "duration": 2,
                "mode": "night"
            },
            {
                "id": "1E6276CC231716FE8EE8BC908486D41E",
                "name": "Термостат",
                "power": 950,
                "duration": 4,
                "mode": "day"
            },
            {
                "id": "7D9DC84AD110500D284B33C82FE6E85E",
                "name": "Кондиционер",
                "power": 550,
                "duration": 14,
                "mode": "day"
            }
        ],
        "rates": [
            {
                "from": 7,
                "to": 11,
                "value": 6.46
            },
            {
                "from": 11,
                "to": 17,
                "value": 5.38
            },
            {
                "from": 17,
                "to": 22,
                "value": 6.46
            },
            {
                "from": 22,
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
      }

      const result = distributeDevices(data);

      assert.equal(result.consumedEnergy.value, 103.25599999999999);

      const expectedData = {
        '7D9DC84AD110500D284B33C82FE6E85E': 46.178,
        '1E6276CC231716FE8EE8BC908486D41E': 20.444,
        'F972B82BA56A70CC579945773B6866FB': 16.359,
        'C515D887EDBBE669B2FDAC62F571E9E9': 19.38,
        '02DDD23A85DADDD71198305330CC386D': 0.895,
      };

      expect(result.consumedEnergy.devices).to.deep.equal(expectedData);

    });
  });
});
