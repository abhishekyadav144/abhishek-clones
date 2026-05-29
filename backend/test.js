async function test() {
  const url = 'https://rukminim2.flixcart.com/image/416/416/xif0q/noodle/o/e/7/-original-imagpghr3v2yhyt5.jpeg?q=70';
  const fetch = globalThis.fetch;
  const r1 = await fetch(url);
  console.log('Without referer:', r1.status);
  
  const r2 = await fetch(url, { headers: { 'Referer': 'http://localhost:3000' } });
  console.log('With localhost referer:', r2.status);
}
test();
