import { connectDB } from "@/lib/db/mongodb";
import { Setting, ISetting } from "@/lib/db/models/Setting";
import { SiteSettingsType } from "../types/settings.types";
import { initialSettings } from "@/lib/db/seed-data";

export async function getSettings(): Promise<SiteSettingsType> {
  try {
    await connectDB();

    let doc = await Setting.findOne({ identifier: "site_settings" }).lean();
    if (!doc) {
      const created = await Setting.create(initialSettings);
      doc = created.toObject();
    }

    if (doc) {
      const s = doc as ISetting & { _id: unknown };
      return JSON.parse(
        JSON.stringify({
          ...s,
          _id: String(s._id),
        })
      ) as SiteSettingsType;
    }
  } catch (error) {
    console.warn("getSettings fallback to initialSettings:", error);
  }

  return JSON.parse(JSON.stringify(initialSettings)) as SiteSettingsType;
}

export async function updateSettings(
  data: Partial<SiteSettingsType>
): Promise<SiteSettingsType> {
  await connectDB();

  const updated = await Setting.findOneAndUpdate(
    { identifier: "site_settings" },
    data,
    { new: true, upsert: true }
  ).lean();

  const s = updated as ISetting & { _id: unknown };
  return JSON.parse(
    JSON.stringify({
      ...s,
      _id: String(s._id),
    })
  ) as SiteSettingsType;
}
