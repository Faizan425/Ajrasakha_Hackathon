export type StateInfo = {
  name: string;
  center: [number, number];
  zoom: number;
};

export const INDIA_STATES: StateInfo[] = [
  { name: "Tamil Nadu", center: [11.1271, 78.6569], zoom: 7 },
  { name: "Andhra Pradesh", center: [15.9129, 79.74], zoom: 7 },
  { name: "Karnataka", center: [15.3173, 75.7139], zoom: 7 },
  { name: "Kerala", center: [10.8505, 76.2711], zoom: 8 },
  { name: "Telangana", center: [18.1124, 79.0193], zoom: 7 },

  { name: "Maharashtra", center: [19.7515, 75.7139], zoom: 6 },
  { name: "Gujarat", center: [22.2587, 71.1924], zoom: 6 },
  { name: "Rajasthan", center: [27.0238, 74.2179], zoom: 6 },
  { name: "Madhya Pradesh", center: [22.9734, 78.6569], zoom: 6 },
  { name: "Chhattisgarh", center: [21.2787, 81.8661], zoom: 7 },

  { name: "Uttar Pradesh", center: [26.8467, 80.9462], zoom: 6 },
  { name: "Bihar", center: [25.0961, 85.3131], zoom: 7 },
  { name: "Jharkhand", center: [23.6102, 85.2799], zoom: 7 },
  { name: "West Bengal", center: [22.9868, 87.855], zoom: 7 },
  { name: "Odisha", center: [20.9517, 85.0985], zoom: 7 },

  { name: "Punjab", center: [31.1471, 75.3412], zoom: 7 },
  { name: "Haryana", center: [29.0588, 76.0856], zoom: 7 },
  { name: "Himachal Pradesh", center: [31.1048, 77.1734], zoom: 7 },
  { name: "Uttarakhand", center: [30.0668, 79.0193], zoom: 7 },

  { name: "Assam", center: [26.2006, 92.9376], zoom: 7 },
  { name: "Arunachal Pradesh", center: [28.218, 94.7278], zoom: 7 },
  { name: "Manipur", center: [24.6637, 93.9063], zoom: 8 },
  { name: "Meghalaya", center: [25.467, 91.3662], zoom: 8 },
  { name: "Mizoram", center: [23.1645, 92.9376], zoom: 8 },
  { name: "Nagaland", center: [26.1584, 94.5624], zoom: 8 },
  { name: "Tripura", center: [23.9408, 91.9882], zoom: 8 },
  { name: "Sikkim", center: [27.533, 88.5122], zoom: 8 },

  { name: "Goa", center: [15.2993, 74.124], zoom: 9 },
];
