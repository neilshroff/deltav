// Delta V — portfolio data. Edit freely; the grid renders from this.
window.DELTAV = {
  brand: {
    name: "Delta V",
    fund: "FUND I — MAR 2026",
    locs: "BENGALURU / SAN FRANCISCO",
    tags: ["PRE-SEED & SEED", "India–US Corridor", "Emerging Markets"],
    headLead: "Investing in India's frontier-tech ",
    headEmph: "outliers.",
    subLead: "Cheap drones, dense batteries, novel metallurgy, industrial robots — ",
    subEmph: "inventions that make the future look like the future.",
    foot: "BY OPERATORS, FOR OPERATORS"
  },
  // motif = which abstract device-artwork to render (see motifs.jsx).
  // url = external site each card links to (opens in a new tab). EDIT THESE
  // to the exact links you want; the stealth card intentionally has none.
  companies: [
    { n: "01", name: "KUBOCARE",       loc: "BENGALURU",       sector: "CARE SENSING",  motif: "kubo",     url: "https://kubocare.com" },
    { n: "02", name: "NEOCAMBRIAN",    loc: "DELHI",           sector: "PHYSICAL AI",   motif: "lattice",  url: "https://neocambrian.ai" },
    { n: "03", name: "BLINQ MOBILITY", loc: "GURUGRAM",        sector: "MOBILITY",      motif: "blinq",    url: "https://blinqmobility.com" },
    { n: "04", name: "ARMATRIX",       loc: "INDIA",           sector: "ROBOTICS",      motif: "armatrix", url: "https://armatrix.in" },
    { n: "05", name: "PLUTO MOBILITY", loc: "DELHI",           sector: "MOBILITY",      motif: "pluto",    url: "https://plutomobility.in" },
    { n: "06", name: "DODO PAYMENTS",  loc: "GLOBAL",          sector: "FINTECH",       motif: "flow",     url: "https://dodopayments.com" },
    { n: "07", name: "DIRAC LABS",     loc: "BENGALURU / US",  sector: "SENSING",       motif: "dirac",    url: "https://diraclabs.com" },
    { n: "08", name: "LAGANN ROBOTICS",loc: "UNDISCLOSED",     sector: "ROBOTICS",      motif: "gantry" },
    { n: "09", name: "[ IN STEALTH ]", loc: "UNDISCLOSED",     sector: "AEROSPACE",     motif: "rotor",    stealth: true }
  ]
};
