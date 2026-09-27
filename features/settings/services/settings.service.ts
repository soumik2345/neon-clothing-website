import { connectDB, isMongoConnected } from "@/lib/db/mongodb";
import { Setting, ISetting } from "@/lib/db/models/Setting";
import { initialSettings } from "@/lib/db/seed-data";
import { SiteSettingsType } from "../types/settings.types";

let localSettings: SiteSettingsType = {
  ...initialSettings,
  _id: "set_default",
};

export async function seedSettingsIfEmpty(): Promise<void> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const count = await Setting.countDocuments({ identifier: "site_settings" });
      if (count === 0) {
        await Setting.create(initialSettings);
        console.log("Successfully seeded MongoDB settings!");
      }
    } catch (e) {
      console.warn("Error seeding MongoDB settings:", e);
    }
  }
}

export async function getSettings(): Promise<SiteSettingsType> {
  await seedSettingsIfEmpty();

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const doc = await Setting.findOne({ identifier: "site_settings" }).lean();
      if (doc) {
        const s = doc as ISetting & { _id: unknown };
        return {
          ...s,
          _id: String(s._id),
        } as SiteSettingsType;
      }
    } catch (err) {
      console.warn("MongoDB getSettings failed, using fallback:", err);
    }
  }

  return localSettings;
}

export async function updateSettings(
  data: Partial<SiteSettingsType>
): Promise<SiteSettingsType> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const updated = await Setting.findOneAndUpdate(
        { identifier: "site_settings" },
        data,
        { new: true, upsert: true }
      ).lean();
      if (updated) {
        const s = updated as ISetting & { _id: unknown };
        return {
          ...s,
          _id: String(s._id),
        } as SiteSettingsType;
      }
    } catch (err) {
      console.warn("MongoDB updateSettings failed, using fallback:", err);
    }
  }

  localSettings = {
    ...localSettings,
    ...data,
  };

  return localSettings;
}
