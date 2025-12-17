import { storage } from "./storage";
import { INDUSTRY_CATEGORIES } from "@shared/schema";

/**
 * Seed the database with industry categories and subcategories
 */
export async function seedCategories() {
  console.log("🌱 Seeding industry categories...");
  
  try {
    // Check if categories already exist
    const existingCategories = await storage.getAllCategories();
    if (existingCategories.length > 0) {
      console.log(`✅ Categories already seeded (${existingCategories.length} categories found)`);
      return;
    }

    let totalCategories = 0;
    let totalSubcategories = 0;

    // Seed each category and its subcategories
    for (const [categoryName, subcategoryNames] of Object.entries(INDUSTRY_CATEGORIES)) {
      // Create category
      const category = await storage.createCategory({
        name: categoryName,
        description: `${categoryName} industry services`,
      });
      
      totalCategories++;
      console.log(`  ✓ Created category: ${categoryName}`);

      // Create subcategories for this category
      for (const subcategoryName of subcategoryNames) {
        await storage.createSubcategory({
          categoryId: category.id,
          name: subcategoryName,
          description: `${subcategoryName} services`,
        });
        
        totalSubcategories++;
      }
      
      console.log(`    ✓ Created ${subcategoryNames.length} subcategories`);
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   📊 Created ${totalCategories} categories`);
    console.log(`   📊 Created ${totalSubcategories} subcategories`);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(() => {
      console.log("\n✅ Seed script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seed script failed:", error);
      process.exit(1);
    });
}

