import { connectDB } from "@/lib/db/mongodb";
import { Setting, ISetting } from "@/lib/db/models/Setting";
import { SiteSettingsType } from "../types/settings.types";
import { initialSettings } from "@/lib/db/seed-data";

export async function getSettings(): Promise<SiteSettingsType> {
  await connectDB();

  let doc = await Setting.findOne({ identifier: "site_settings" }).lean();
  if (!doc) {
    const created = await Setting.create(initialSettings);
    doc = created.toObject();
  }

  const s = doc as ISetting & { _id: unknown };
  return {
    ...s,
    _id: String(s._id),
  } as SiteSettingsType;
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
  return {
    ...s,
    _id: String(s._id),
  } as SiteSettingsType;
}
