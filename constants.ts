
export const SOUTH_FLORIDA_COUNTIES = ["Monroe", "Broward", "Dade", "Palm Beach", "St. Lucie"];

export const LOCATION_OPTIONS = [
  { value: "all_florida", label: "All Florida" },
  { value: "south_florida", label: "South Florida" },
] as const;

export const ALL_PRICE_RANGES_OPTION = "All price ranges";

export const BEDS_OPTIONS = ["2+", "3+", "4+", "5+", "Any"] as const;
export const BATHS_OPTIONS = ["1+", "2+", "3+", "Any"] as const;




export const COUNTIES = [
  "Broward", "Dade", "Palm Beach", "St. Lucie", "Alachua", "Baker", "Bay", "Bradford", 
  "Brevard", "Charlotte", "Citrus", "Clay", "Collier", "Columbia", "Desoto", "Dixie", 
  "Escambia", "Duval", "Flagler", "Gilchrist", "Glades", "Hamilton", "Hardee", 
  "Hendry", "Hernando", "Highlands", "Hillsborough", "Indian River", "Jackson", 
  "Lafayette", "Lake", "Lee", "Leon", "Levy", "Manatee", "Martin", "Marion", 
  "Monroe", "Nassau", "Okaloosa", "Okeechobee", "Orange", "Osceola", "Pasco", 
  "Pinellas", "Polk", "Putnam", "Santa Rosa", "Sarasota", "Seminole", "St. Johns", 
  "Sumter", "Suwannee", "Union", "Volusia", "Washington"
];

export const CITIES_BY_COUNTY: Record<string, string[]> = {
  "Broward": [
    "Coconut Creek", "Cooper City", "Coral Springs", "Dania Beach", "Davie", "Deerfield Beach",
    "Fort Lauderdale", "Hallandale Beach", "Hillsboro Beach", "Hollywood", "Lauderdale Lakes", "Lauderdale-By-The-Sea",
    "Lauderhill", "Lazy Lake", "Lighthouse Point", "Margate", "Miramar", "North Lauderdale",
    "Oakland Park", "Parkland", "Pembroke Park", "Pembroke Pines", "Plantation", "Pompano Beach",
    "Sea Ranch Lakes", "Southwest Ranches", "Sunrise", "Tamarac", "West Park", "Weston",
    "Wilton Manors"
  ],
  "Dade": [
    "Aventura", "Bal Harbour", "Bay Harbor Islands", "Biscayne Park", "Coral Gables", "Cutler Bay",
    "Doral", "El Portal", "Florida City", "Golden Beach", "Hialeah", "Hialeah Gardens",
    "Homestead", "Indian Creek", "Key Biscayne", "Medley", "Miami", "Miami Beach",
    "Miami Gardens", "Miami Lakes", "Miami Shores", "Miami Springs", "North Bay Village", "North Miami",
    "North Miami Beach", "Opa-locka", "Palmetto Bay", "Pinecrest", "South Miami", "Sunny Isles Beach",
    "Surfside", "Sweetwater", "Virginia Gardens", "West Miami"
  ],
  "Palm Beach": [
    "Atlantis", "Belle Glade", "Boca Raton", "Boynton Beach", "Briny Breezes", "Cloud Lake",
    "Delray Beach", "Glen Ridge", "Golf", "Greenacres", "Gulf Stream", "Haverhill",
    "Highland Beach", "Hypoluxo", "Juno Beach", "Jupiter", "Jupiter Inlet Colony", "Lake Clarke Shores",
    "Lake Park", "Lake Worth Beach", "Lantana", "Loxahatchee Groves", "Manalapan", "Mangonia Park",
    "North Palm Beach", "Ocean Ridge", "Pahokee", "Palm Beach", "Palm Beach Gardens", "Palm Beach Shores",
    "Palm Springs", "Riviera Beach", "Royal Palm Beach", "South Bay", "South Palm Beach", "Tequesta",
    "Wellington", "West Palm Beach", "Westlake"
  ],
  "St. Lucie": [
    "Fort Pierce", "Port St. Lucie", "St. Lucie Village"
  ],
  "Alachua": [
    "Alachua", "Archer", "Gainesville", "Hawthorne", "High Springs", "La Crosse",
    "Micanopy", "Newberry", "Waldo"
  ],
  "Baker": [
    "Glen St. Mary", "Macclenny"
  ],
  "Bay": [
    "Callaway", "Lynn Haven", "Mexico Beach", "Panama City", "Panama City Beach", "Parker",
    "Springfield"
  ],
  "Bradford": [
    "Brooker", "Hampton", "Lawtey", "Starke"
  ],
  "Brevard": [
    "Cape Canaveral", "Cocoa", "Cocoa Beach", "Grant-Valkaria", "Indialantic", "Indian Harbour Beach",
    "Malabar", "Melbourne", "Melbourne Beach", "Melbourne Village", "Palm Bay", "Palm Shores",
    "Rockledge", "Satellite Beach", "Titusville", "West Melbourne"
  ],
  "Charlotte": [
    "Punta Gorda"
  ],
  "Citrus": [
    "Crystal River", "Inverness"
  ],
  "Clay": [
    "Green Cove Springs", "Keystone Heights", "Orange Park", "Penney Farms"
  ],
  "Collier": [
    "Everglades", "Marco Island", "Naples"
  ],
  "Columbia": [
    "Fort White", "Lake City"
  ],
  "Desoto": [
    "Arcadia"
  ],
  "Dixie": [
    "Cross City", "Horseshoe Beach"
  ],
  "Escambia": [
    "Century", "Pensacola"
  ],
  "Duval": [
    "Atlantic Beach", "Baldwin", "Jacksonville", "Jacksonville Beach", "Neptune Beach"
  ],
  "Flagler": [
    "Beverly Beach", "Bunnell", "Flagler Beach", "Marineland", "Palm Coast"
  ],
  "Gilchrist": [
    "Bell", "Fanning Springs", "Trenton"
  ],
  "Glades": [
    "Moore Haven"
  ],
  "Hamilton": [
    "Jasper", "Jennings", "White Springs"
  ],
  "Hardee": [
    "Bowling Green", "Wauchula", "Zolfo Springs"
  ],
  "Hendry": [
    "Clewiston", "LaBelle"
  ],
  "Hernando": [
    "Brooksville"
  ],
  "Highlands": [
    "Avon Park", "Lake Placid", "Sebring"
  ],
  "Hillsborough": [
    "Plant City", "Tampa", "Temple Terrace"
  ],
  "Indian River": [
    "Fellsmere", "Indian River Shores", "Orchid", "Sebastian", "Vero Beach"
  ],
  "Jackson": [
    "Alford", "Bascom", "Campbellton", "Cottondale", "Graceville", "Grand Ridge",
    "Greenwood", "Jacob City", "Malone", "Marianna", "Sneads"
  ],
  "Lafayette": [
    "Mayo"
  ],
  "Lake": [
    "Astatula", "Clermont", "Eustis", "Fruitland Park", "Groveland", "Howey-in-the-Hills",
    "Lady Lake", "Leesburg", "Mascotte", "Minneola", "Montverde", "Mount Dora",
    "Tavares", "Umatilla"
  ],
  "Lee": [
    "Bonita Springs", "Cape Coral", "Estero", "Fort Myers", "Fort Myers Beach", "Sanibel"
  ],
  "Leon": [
    "Tallahassee"
  ],
  "Levy": [
    "Bronson", "Cedar Key", "Chiefland", "Fanning Springs", "Inglis", "Otter Creek",
    "Williston", "Yankeetown"
  ],
  "Manatee": [
    "Anna Maria", "Bradenton", "Bradenton Beach", "Holmes Beach", "Longboat Key", "Palmetto"
  ],
  "Martin": [
    "Indiantown", "Jupiter Island", "Ocean Breeze", "Sewall's Point", "Stuart"
  ],
  "Marion": [
    "Belleview", "Dunnellon", "McIntosh", "Ocala", "Reddick"
  ],
  "Monroe": [
    "Islamorada", "Key Colony Beach", "Key West", "Layton", "Marathon"
  ],
  "Nassau": [
    "Callahan", "Fernandina Beach", "Hilliard"
  ],
  "Okaloosa": [
    "Cinco Bayou", "Crestview", "Destin", "Fort Walton Beach", "Laurel Hill", "Mary Esther",
    "Niceville", "Shalimar", "Valparaiso"
  ],
  "Okeechobee": [
    "Okeechobee"
  ],
  "Orange": [
    "Apopka", "Bay Lake", "Belle Isle", "Eatonville", "Edgewood", "Lake Buena Vista",
    "Maitland", "Oakland", "Ocoee", "Orlando", "Windermere", "Winter Garden",
    "Winter Park"
  ],
  "Osceola": [
    "Kissimmee", "St. Cloud"
  ],
  "Pasco": [
    "Dade City", "New Port Richey", "Port Richey", "San Antonio", "St. Leo", "Zephyrhills"
  ],
  "Pinellas": [
    "Belleair", "Belleair Beach", "Belleair Bluffs", "Belleair Shore", "Clearwater", "Dunedin",
    "Gulfport", "Indian Rocks Beach", "Indian Shores", "Kenneth City", "Largo", "Madeira Beach",
    "North Redington Beach", "Oldsmar", "Pinellas Park", "Redington Beach", "Redington Shores", "Safety Harbor",
    "Seminole", "South Pasadena", "St. Pete Beach", "St. Petersburg", "Tarpon Springs", "Treasure Island"
  ],
  "Polk": [
    "Auburndale", "Bartow", "Davenport", "Dundee", "Eagle Lake", "Fort Meade",
    "Frostproof", "Haines City", "Highland Park", "Hillcrest Heights", "Lake Alfred", "Lake Hamilton",
    "Lake Wales", "Lakeland", "Mulberry", "Polk City", "Winter Haven"
  ],
  "Putnam": [
    "Crescent City", "Interlachen", "Palatka", "Pomona Park", "Welaka"
  ],
  "Santa Rosa": [
    "Gulf Breeze", "Jay", "Milton"
  ],
  "Sarasota": [
    "Longboat Key", "North Port", "Sarasota", "Venice"
  ],
  "Seminole": [
    "Altamonte Springs", "Casselberry", "Lake Mary", "Longwood", "Oviedo", "Sanford",
    "Winter Springs"
  ],
  "St. Johns": [
    "Marineland", "St. Augustine", "St. Augustine Beach"
  ],
  "Sumter": [
    "Bushnell", "Center Hill", "Coleman", "Webster", "Wildwood"
  ],
  "Suwannee": [
    "Branford", "Live Oak"
  ],
  "Union": [
    "Lake Butler", "Raiford", "Worthington Springs"
  ],
  "Volusia": [
    "Daytona Beach", "Daytona Beach Shores", "DeBary", "DeLand", "Deltona", "Edgewater",
    "Flagler Beach", "Holly Hill", "Lake Helen", "New Smyrna Beach", "Oak Hill", "Orange City",
    "Ormond Beach", "Pierson", "Ponce Inlet", "Port Orange", "South Daytona"
  ],
  "Washington": [
    "Caryville", "Chipley", "Ebro", "Vernon", "Wausau"
  ],
  "default": ["All Cities"]
};

export const PRICE_RANGES_DEFAULT = [
  "All price ranges",
  "$0 - $300,000",
  "$300,000 - $600,000",
  "$600,000 - $1,000,000",
  "$1,000,000+"
];

export const PRICE_RANGES_CONDO_TH = [
  "All price ranges",
  "$0 - $100,000",
  "$100,000 - $175,000",
  "$175,000 - $300,000",
  "$300,000 - $600,000",
  "$600,000 - $1,000,000"
];

export const PROPERTY_LOCATION_OPTIONS = [
  { value: "all_florida", label: "All Florida" },
  { value: "south_florida", label: "South Florida" },
  { value: "counties", label: "Counties" },
  { value: "cities", label: "Cities" },
] as const;

export const PROPERTY_CONFIG = {
   singleFamily: {
    title: "Single Family",
    options: ["Yes, I am interested in Single Family Houses"],
    prefs: [
      "Property Needs a Full Rehab",
      "Property has Code Violations / Liens / Fines",
      "Property is Fire Damaged",
      "Need to Buy Property Sight Unseen (Bad Tenants, Other Access Issues) - Videos or Pictures might be available case by case.",
      "Property with Ocean Access / Intracoastal",
      "$1 Million Dollar Houses and Up",
      "55 Plus Communities",
      "Frame Construction",
      "Bulk Property Packages",
      "Mold Remediation Needed",
      "Property has Foundation / Structural Issues",
      "Water/ Flood Damage",
      "Tear-downs / Land Value Only",
      "Unpermitted Additions",
      "Eviction Needed/ In Progress",
      "Post Occupancy Required (with escrow holdback and/ or rent)",
      "Pool",
      "Garage"
    ]
  },
  multiFamily: {
    title: "Multi Family",
    options: [
      "Multi Family (Duplex, Triplex, Fourplex)",
      "Multi Family (5-25 Units)",
      "Multi Family (25-50 Units)",
      "Multi Family (50-75 Units)",
      "Multi Family (75-100 Units)",
      "Multi Family (100+ Units)"
    ],
    prefs: [
      "Property Needs a Full Rehab",
      "Property has Code Violations / Liens / Fines",
      "Property is Fire Damaged",
      "Need to Buy Property Sight Unseen (Bad Tenants, Other Access Issues) - Videos or Pictures might be available case by case.",
      "Frame Construction",
      // "Mold Remediation Needed",
      "Property has Foundation / Structural Issues",
      "40/10 Year Inspection Certificate Failed",
"40/10 Year Inspection Certificate Passed"
    ]
  },
  condo: {
    title: "Condo",
    options: [
      "Condos in General - Any Location",
      "Located on Beach Front Only",
      "Located on Ocean Access / Intracoastal Way Only",
      "Located on Water Front Only",
      "Located on Golf Course Only",
      "Property has Rental Restrictions",
      "Property has Special Assessments"
    ],
    prefs: [
      "Bulk Property Packages",
      "Property has Foundation / Structural Issues",
      "55 Plus Communities",
      "Property has Rental Restrictions",
      "Property has Special Assessments",
      "Located on Ocean Access / Intracoastal Way Only",
      "Located on Water Front Only",
      "Located on Golf Course Only",
      "40 Year Inspection Failed",
      "NO HOA"
    ]
  },
  land: {
    title: "Land",
    options: [
      "Tear-down houses/ buildings/ land value",
      "Single Family Residential",
      "Commercial",
      "Zoned Multi family",
      "Zoned Townhouse",
      "Ocean Access/ Intracoastal",
      "Agriculture",
      "Industrial",
      "Special Use",
      // "Tear-downs / land value only"
    ],
    prefs: [
      "Property has Code Violations / Liens / Fines",
      // "Property with Ocean Access / Intracoastal",
      // "$1 Million Dollar Houses and Up",
      "Bulk Property Packages",
    ]
  },
  commercial: {
    title: "Commercial",
    options: [
      "Hotel/Motel", "Shopping Center", "Warehouse", "Storefront", "Mixed Use",
      "Marina", "Industrial", "Billboard", "Hospital", "Church", "Office Building",
      "Fast Food", "Assisted Living", "Medical", "Manufacturing", "Dockage",
      "Car Wash", "Mineral", "Oil, Gas, Metals", "Stadium", "Adult Entertainment",
      "Gambling", "Farms", "Drug rehab centre", "Other"
    ],
    prefs: [
      "Property Needs a Full Rehab",
      "Property has Code Violations / Liens / Fines",
      "Property is Fire Damaged",
      "Need to Buy Property Sight Unseen (Bad Tenants, Other Access Issues) - Videos or Pictures might be available case by case.",
      "Property with Ocean Access / Intracoastal",
      "$1 Million Dollar Houses and Up",
      "55 Plus Communities",
      "Frame Construction",
      "Mobile Homes",
      "Bulk Property Packages",
      "Mold Remediation Needed",
      "Property has Foundation / Structural Issues"
    ]
  },
 
  townhouse: {
    title: "Town House",
    options: ["Townhouses in General - Any Location"],
    prefs: [
      "Property Needs a Full Rehab",
      "Property has Code Violations / Liens / Fines",
      "Property is Fire Damaged",
      "Need to Buy Property Sight Unseen (Bad Tenants, Other Access Issues) - Videos or Pictures might be available case by case.",
      "Property with Ocean Access / Intracoastal",
      // "$1 Million Dollar Houses and Up",
      "55 Plus Communities",
      "Frame Construction",
      "Bulk Property Packages",
      "Mold Remediation Needed",
      "Property has Foundation / Structural Issues",
      "Water/ Flood Damage",
      // "Tear-downs / land value only",
      "Unpermitted Additions",
      "Eviction Needed/ In Progress",
      "Post Occupancy Required (with escrow holdback and/ or rent)",
       "Pool",
      "Garage"
    ]
  }
};


