const { performance } = require('node:perf_hooks');

const url = process.argv[2];

if (!url) {
  console.error('Использование: node index.js <URL>');
  process.exit(1);
}

async function main() {
  let totalBytes = 0;
  let totalTime = 0;

  for (let i = 1; i <= 10; i++) {
    const start = performance.now();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} (запрос ${i})`);
    }

    const data = await response.arrayBuffer();
    const seconds = (performance.now() - start) / 1000;

    totalTime += seconds;
    totalBytes += data.byteLength;
    console.log(`Запрос ${i}/10: ${seconds.toFixed(3)} с`);
  }

  const averageTime = totalTime / 10;
  const speedMbps = (totalBytes * 8) / totalTime / 1_000_000;

  console.log(`Среднее время запроса: ${averageTime.toFixed(3)} с`);
  console.log(`Скачано: ${totalBytes} байт`);
  console.log(`Скорость скачивания: ${speedMbps.toFixed(2)} Мбит/с`);
}

main().catch((error) => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});
