// Run with: mongosh "mongodb://localhost:27017/sba301_slot32" scripts/schema-validation.js
// This optional server-side validator demonstrates that flexible schema can still enforce a contract.
db.runCommand({
  collMod: "products",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "createdAt"],
      properties: {
        name: { bsonType: "string" },
        price: { bsonType: ["decimal", "double", "int", "long"], minimum: 0 },
        active: { bsonType: "bool" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        specs: {
          bsonType: "object",
          properties: {
            ports: { bsonType: "int", minimum: 0 },
            hdmi: { bsonType: "bool" },
            powerDeliveryW: { bsonType: "int", minimum: 0 }
          }
        },
        categoryId: { bsonType: "string" },
        createdAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
