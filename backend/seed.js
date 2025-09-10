import pool from "./db.js";

const seedProducts = async () => {
  try {
    await pool.query("DELETE FROM products"); // clear old data
    
    console.log("🚗 Seeding car products...");
    
    await pool.query(`
      INSERT INTO products (title, description, price, image_url, stock) VALUES
      -- Luxury Electric Vehicles
      ('Tesla Model S Plaid', 'Ultra-high performance electric sedan with tri-motor setup and 1020 horsepower.', 129990, 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Main-Hero-Desktop-LHD.jpg', 8),
      ('Tesla Model 3 Performance', 'Sporty electric sedan with autopilot and superb handling.', 55990, 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg', 15),
      ('Tesla Model X', 'Luxury electric SUV with falcon wing doors and 7-seat capacity.', 109990, 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Main-Hero-Desktop-LHD.jpg', 7),
      ('Tesla Cybertruck', 'Revolutionary electric pickup truck with bulletproof design.', 99990, 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/cybertruck-homepage-desktop.jpg', 5),
      
      -- Luxury Sports Cars
      ('Lamborghini Huracán', 'Italian supercar with naturally aspirated V10 engine and all-wheel drive.', 248295, 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_gw/huracan/2023/09_15_refresh/huracan_gate_01_m.jpg', 3),
      ('Ferrari 488 GTB', 'Mid-engine sports car with twin-turbo V8 and exceptional performance.', 262647, 'https://www.ferrari.com/content/dam/ferrari/common/models/488-gtb/overview/ferrari-488-gtb-2015-main.jpg', 2),
      ('McLaren 720S', 'British supercar with carbon fiber construction and 710 horsepower.', 299000, 'https://cars.mclaren.com/content/dam/mclaren-automotive/images/model-24my-hero-01.jpg', 4),
      ('Porsche 911 Turbo S', 'Iconic rear-engine sports car with twin-turbo flat-six engine.', 207000, 'https://files.porsche.com/filestore/image/multimedia/none/992-turbo-s-coupe-modelimage-sideshot/model/930894f1-6214-11ea-80c4-005056bbdc38/porsche-model.png', 6),
      
      -- Luxury Sedans & SUVs
      ('BMW M5 Competition', 'High-performance luxury sedan with twin-turbo V8 and all-wheel drive.', 103500, 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-2545xM4RIyFnbm9Mb3AgyyIJrjG', 9),
      ('Mercedes-AMG GT 63 S', '4-door coupe with handcrafted twin-turbo V8 engine.', 161500, 'https://assets.mbusa.com/cmsMedia/representation/01/fb/knowledgeDetail_01fb02b2-cb56-4109-94c1-66a0186ffa79_620x348.jpg', 7),
      ('Audi RS6 Avant', 'Performance wagon with twin-turbo V8 and quattro all-wheel drive.', 109000, 'https://audimediacenter-a.akamaihd.net/system/production/media/1282/images/7db098067a5c9cf13df343dd8d0602e4b4ba10a7/A191199_web_2880.jpg', 8),
      ('Range Rover Sport SVR', 'High-performance luxury SUV with supercharged V8 engine.', 115000, 'https://www.landrover.com/content/dam/jaguar-landrover/landrover/range-rover-sport/L494-MY23/exterior/22MY_RRS_Exterior_Location_281121_04.jpg', 5),
      
      -- Classic American Muscle
      ('Ford Mustang Shelby GT500', 'Supercharged American muscle car with 760 horsepower.', 80000, 'https://www.ford.com/is/image/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2024/collections/dm/24_FRD_MST_55067.tif', 10),
      ('Chevrolet Corvette Z06', 'Mid-engine American sports car with naturally aspirated V8.', 106395, 'https://media.chevrolet.com/content/media/us/en/chevrolet/vehicles/corvette/2024/_jcr_content/par/image.img.jpg/1673443081303.jpg', 8),
      ('Dodge Challenger SRT Hellcat', 'Supercharged muscle car with retro styling and 717 horsepower.', 71490, 'https://www.stellantis.com/content/dam/stellantis-corporate/brands/dodge/vehicles/challenger/MY22_Challenger_SRT_Hellcat_PDB_Oct2021.jpg', 12),
      ('Camaro ZL1', 'Track-focused muscle car with supercharged LT4 V8 engine.', 69000, 'https://media.chevrolet.com/content/media/us/en/chevrolet/vehicles/camaro/2024/_jcr_content/par/image.img.jpg/1696527274469.jpg', 9),
      
      -- Luxury Grand Tourers
      ('Bentley Continental GT', 'Luxury grand tourer with twin-turbo W12 engine and handcrafted interior.', 230000, 'https://www.bentleymotors.com/content/dam/bm/websites/bmcom/bentleymotors-com/models/continental-gt/continental-gt-overview/continental-gt-overview-hero-1920x1080.jpg', 4),
      ('Aston Martin DB11', 'British grand tourer with twin-turbo V8 or V12 engine options.', 215000, 'https://www.astonmartin.com/globalassets/00-global-site/models/db11/my24/overview/db11-v8-coupe-overview-header-1920x1080.jpg', 3),
      ('Maserati MC20', 'Italian supercar with twin-turbo V6 Nettuno engine.', 216995, 'https://www.maserati.com/content/dam/maserati/international/Models/default/2020/mc20/overview/masonry/MC20_01.jpg', 6),
      
      -- Practical Performance
      ('Subaru WRX STI', 'Rally-bred sports sedan with turbocharged boxer engine and AWD.', 37895, 'https://www.subaru.com/content/dam/subaru/vehicles/2024/WRX/2024-WRX-1920x1080.jpg', 20),
      ('Honda Civic Type R', 'Track-focused hot hatch with naturally aspirated turbo engine.', 44000, 'https://automobiles.honda.com/content/dam/ahm/automobiles/grade-pages/2024/civic-type-r/2024-civic-type-r-overview-hero-lg-1400x600.jpg', 15),
      ('Volkswagen Golf R', 'High-performance hatchback with turbocharged engine and 4MOTION AWD.', 45000, 'https://media.vw.com/content/dam/vw-media/2022/01/26/VW_Golf_R_2022_001.jpg', 18);
    `);
    
    console.log("✅ Enhanced car products seeded successfully!");
    console.log("📊 Total products: 25 cars across various categories");
    console.log("🏷️ Categories: Electric, Luxury Sports, Muscle Cars, Grand Tourers, Performance");
    
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    process.exit();
  }
};

// Add error handling for database connection
const runSeeder = async () => {
  try {
    await seedProducts();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

runSeeder();