const platforms = [
  { name: "Apolo Pay", image: "/platforms/apolo-pay.png" },
  { name: "Binance", image: "/platforms/binance.png" },
  { name: "Bitget", image: "/platforms/bitget.png" },
  { name: "Bybit", image: "/platforms/bybit.png" },
  { name: "Dorado", image: "/platforms/dorado.png" },
  { name: "Kucoin", image: "/platforms/kucoin.png" },
  { name: "Paxful", image: "/platforms/paxful.png" },
];

const platformIcons: Record<string, string> = {};

platforms.forEach(({ name, image }) => {
  platformIcons[name] = image;
});

export default platformIcons;
