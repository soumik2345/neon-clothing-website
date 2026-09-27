import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black font-mono">
          Size &amp; Fit Guide
        </h1>

        <div className="bg-white border border-neutral-200 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-100 uppercase font-bold text-neutral-800 border-b border-neutral-200">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Chest (Inches)</th>
                <th className="p-3">Length (Inches)</th>
                <th className="p-3">Shoulder (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="p-3 font-bold">S</td>
                <td className="p-3">38 - 40</td>
                <td className="p-3">27</td>
                <td className="p-3">19.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">M</td>
                <td className="p-3">42 - 44</td>
                <td className="p-3">28.5</td>
                <td className="p-3">21</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">L</td>
                <td className="p-3">46 - 48</td>
                <td className="p-3">29.5</td>
                <td className="p-3">22.5</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">XL</td>
                <td className="p-3">50 - 52</td>
                <td className="p-3">30.5</td>
                <td className="p-3">24</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
