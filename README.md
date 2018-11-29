# Жадный алгоритм

Алгоритм распределения графика работы устройств для "умного дома".

Цель - распределить графики работы устройств таким образом, чтобы плата за электроэнергию была минимальной.
Ограничения - мощность устройств, которые могут работать одновременно, тарифы согласно временным периодам.

1. Распределяются устройства исходя из периода работы (день/ночь)
2. Первыми распределяются устройства с максимальной мощностью.
3. Проверяется возможность работы на стыке временных периодов.
