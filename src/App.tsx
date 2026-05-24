import { useEffect, useRef, useState } from "react"; //LOADING EFFECT
import {
  Home,
  CheckSquare,
  Folder,
  Settings,
  Printer,
  ClipboardList,
  CircleCheck,
  CircleSlash,
  Users,
  BookOpen,
  CalendarDays,
  FileDown,
} from "lucide-react"; // SVG ICONS
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; //PDF EXPORT

import logo from "./assets/logo-katie.png";
import clipboardImage from "./assets/clipboard-primrose.png";
import { cleanMaterials } from "./utils/cleanMaterials";

//FILTER BAR
type ChecklistItem = {
  id: string;
  classroom: string;
  unit: string;
  week: string;
  day: string;
  date: string;
  lesson: string;
  material: string;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState("Preschool/Pre-K");
  const [unit, setUnit] = useState("Unit 1");
  const [week, setWeek] = useState("Week 1–2");
  const [day, setDay] = useState("Monday");
  const [date, setDate] = useState("");
  const [lessonTexts, setLessonTexts] = useState<Record<string, string>>({});
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [ignoredMaterials, setIgnoredMaterials] = useState<string[]>([]);

  const checklistRef = useRef<HTMLDivElement>(null);

  // PRESCHOOL- PRE-K
  const preschoolLessons = [
    "Noggin Joggin",
    "Small Group Literacy (SGL)",
    "Project Time (PT)",
    "Small Group Math (SGM)",
  ];
  // INFANTS, TODDLERS, EP1, EP2, PATHWAYS
  const otherLessons = [
    "Noggin Joggin (NJ)",
    "Wondertime 1 (WT1)",
    "Wondertime 2 (WT2)",
    "Wondertime 3 (WT3)",
  ];

  // DEFAULT SETTING PRESCHOOL/PRE-K
  const lessonOptions =
    classroom === "Preschool/Pre-K" ? preschoolLessons : otherLessons;

  // CALENDAR
  const formatDate = (dateValue: string) => {
    if (!dateValue) return "Select date";

    return new Date(dateValue + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const ignoredSet = new Set(ignoredMaterials);

  const totalMaterials = items.length;
  const plannedDays = new Set(items.map((item) => item.day)).size;
  const savedPlans = 0;
  const ignoredItems = ignoredMaterials.length;

  const addAllMaterials = () => {
    const newItems: ChecklistItem[] = [];

    lessonOptions.forEach((lesson) => {
      const cleanedMaterials = cleanMaterials(lessonTexts[lesson] || "").filter(
        (material) => !ignoredSet.has(material.toLowerCase()),
      );

      cleanedMaterials.forEach((material) => {
        newItems.push({
          id: crypto.randomUUID(),
          classroom,
          unit,
          week,
          day,
          date: formatDate(date),
          lesson,
          material,
        });
      });
    });

    setItems((prev) => {
      const existing = new Set(
        prev.map(
          (item) =>
            `${item.week}-${item.day}-${item.lesson}-${item.material.toLowerCase()}`,
        ),
      );

      const filtered = newItems.filter(
        (item) =>
          !existing.has(
            `${item.week}-${item.day}-${item.lesson}-${item.material.toLowerCase()}`,
          ),
      );

      return [...prev, ...filtered];
    });

    setLessonTexts({});
  };

  const hasMaterialsToAdd = lessonOptions.some((lesson) =>
    cleanMaterials(lessonTexts[lesson] || "").some(
      (material) => !ignoredSet.has(material.toLowerCase()),
    ),
  );

  const groupedByDay = items.reduce<Record<string, ChecklistItem[]>>(
    (groups, item) => {
      const key = `${item.week} • ${item.day} • ${item.date}`;

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);

      return groups;
    },
    {},
  );

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const ignoreMaterial = (material: string) => {
    const normalizedMaterial = material.toLowerCase();

    setIgnoredMaterials((prev) => {
      if (prev.includes(normalizedMaterial)) return prev;
      return [...prev, normalizedMaterial];
    });

    setItems((prev) =>
      prev.filter((item) => item.material.toLowerCase() !== normalizedMaterial),
    );
  };

  const exportPDF = async () => {
    if (!checklistRef.current) return;

    const hiddenElements =
      checklistRef.current.querySelectorAll(".export-hide");

    hiddenElements.forEach((element) => {
      (element as HTMLElement).style.display = "none";
    });

    const canvas = await html2canvas(checklistRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    hiddenElements.forEach((element) => {
      (element as HTMLElement).style.display = "";
    });

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imageWidth = pdfWidth - 20;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;

    let heightLeft = imageHeight;
    let position = 10;

    pdf.addImage(imageData, "PNG", 10, position, imageWidth, imageHeight);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imageHeight + 10;

      pdf.addPage();
      pdf.addImage(imageData, "PNG", 10, position, imageWidth, imageHeight);

      heightLeft -= pdfHeight;
    }

    const fileName = `Katies-Crate-${classroom}-${unit}-${week}.pdf`.replace(
      /\s+/g,
      "-",
    );

    pdf.save(fileName);
  };

  useEffect(() => {
    setLessonTexts({});
  }, [classroom]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  //LOADING SCREEN
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f7f3ec]">
        <img
          src={logo}
          alt="Katie's Crate Logo"
          className="mb-6 w-52 animate-pulse object-contain"
        />

        <h1 className="text-6xl font-bold text-[#496b3f] font-['Cormorant_Garamond']">
          Katie’s Crate
        </h1>

        <p className="mt-3 text-lg text-[#7d746b]">
          Preparing classroom materials...
        </p>

        <div className="mt-6 flex gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#8dad6c]" />
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#8dad6c] [animation-delay:150ms]" />
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#8dad6c] [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#2f2a24]">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#e6dccd] bg-[#fbf8f1] p-6">
        <div className="mb-10 flex justify-center">
          <img
            src={logo}
            alt="Katie's Crate Logo"
            className="w-56 object-contain"
          />
        </div>

        <nav className="space-y-3">
          <button className="flex w-full items-center gap-3 rounded-xl bg-[#e8f0dc] px-4 py-3 text-left font-semibold text-[#48663c]">
            <Home size={22} />
            Home
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-[#f3ede2]">
            <CheckSquare size={22} />
            Checklist
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-[#f3ede2]">
            <Folder size={22} />
            Saved Plans
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-[#f3ede2]">
            <CircleSlash size={22} />
            Ignored Items
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-[#f3ede2]">
            <Settings size={22} />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-[#eef6e6] p-4 text-sm">
          <p className="mb-2 text-2xl font-bold text-[#48663c] font-['Cormorant_Garamond']">
            ♡ Our Mission
          </p>

          <p>Make classroom prep simple, organized, and stress-free.</p>
        </div>
      </aside>

      <main className="ml-64 p-10">
        <header className="mb-8 flex items-center justify-between no-print">
          <h1 className="text-7xl font-bold leading-none text-[#496b3f] font-['Cormorant_Garamond']">
            Katie’s Crate
          </h1>
        </header>

        <section className="mb-6 grid grid-cols-4 gap-5 no-print">
          <div className="flex items-center gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf4e5] text-[#5f854b]">
              <ClipboardList size={34} />
            </div>

            <div>
              <p className="text-lg font-semibold leading-tight text-[#6f675f]">
                Planned Days
              </p>

              <p className="text-5xl font-bold leading-none font-['Cormorant_Garamond']">
                {plannedDays}
              </p>

              <p className="mt-2 text-[#6f8f52]">Based on checklist →</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3d8] text-[#a17426]">
              <Folder size={34} />
            </div>

            <div>
              <p className="text-lg font-semibold text-[#6f675f]">
                Saved Plans
              </p>

              <p className="text-5xl font-bold leading-none font-['Cormorant_Garamond']">
                {savedPlans}
              </p>

              <p className="mt-2 text-[#6f8f52]">Coming soon →</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fde8dd] text-[#9a5b42]">
              <CircleSlash size={36} />
            </div>

            <div>
              <p className="text-lg font-semibold text-[#6f675f]">
                Ignored Items
              </p>

              <p className="text-5xl font-bold leading-none font-['Cormorant_Garamond']">
                {ignoredItems}
              </p>

              <p className="mt-2 text-[#6f8f52]">Auto-hidden →</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf4e5] text-[#5f854b]">
              <CircleCheck size={38} />
            </div>

            <div>
              <p className="text-lg font-semibold text-[#6f675f]">Materials</p>

              <p className="text-5xl font-bold leading-none font-['Cormorant_Garamond']">
                {totalMaterials}
              </p>

              <p className="mt-2 text-[#6f675f]">Added to crate</p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm no-print">
          <h2 className="text-4xl font-bold font-['Cormorant_Garamond']">
            Create Checklist
          </h2>

          <p className="mb-6 text-[#6f675f]">
            Select the class, unit, week, day, and date. Then paste materials
            into each lesson box.
          </p>

          <div className="grid grid-cols-5 gap-4">
            <div className="relative">
              <Users
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f854b]"
                size={22}
              />

              <select
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#ddd1c0] bg-white p-3 pl-12"
              >
                <option>Preschool/Pre-K</option>
                <option>Infants</option>
                <option>Toddlers</option>
                <option>EP1</option>
                <option>EP2</option>
                <option>Pathways</option>
              </select>
            </div>

            <div className="relative">
              <BookOpen
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f854b]"
                size={22}
              />

              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#ddd1c0] bg-white p-3 pl-12"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i}>Unit {i + 1}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <CalendarDays
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f854b]"
                size={22}
              />

              <select
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#ddd1c0] bg-white p-3 pl-12"
              >
                <option>Week 1</option>
                <option>Week 2</option>
                <option>Week 3</option>
                <option>Week 4</option>
                <option>Week 1–2</option>
                <option>Week 3–4</option>
              </select>
            </div>

            <div className="relative">
              <CalendarDays
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f854b]"
                size={22}
              />

              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#ddd1c0] bg-white p-3 pl-12"
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>
            </div>

            <div className="relative">
              <CalendarDays
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f854b]"
                size={22}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#ddd1c0] bg-white p-3 pl-12"
              />
            </div>
          </div>

          {date && (
            <p className="mt-4 text-sm text-[#6f675f]">
              Selected date:{" "}
              <span className="font-semibold text-[#496b3f]">
                {day} • {formatDate(date)}
              </span>
            </p>
          )}
        </section>

        <section className="grid grid-cols-2 gap-6 print:block">
          <div className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm no-print">
            <h2 className="text-4xl font-bold font-['Cormorant_Garamond']">
              1. Paste Materials
            </h2>

            <p className="mb-4 text-[#6f675f]">
              Paste each lesson’s materials once, then add everything together.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {lessonOptions.map((lesson) => (
                <div key={lesson}>
                  <label className="mb-2 block font-semibold text-[#496b3f]">
                    {lesson}
                  </label>

                  <textarea
                    className="h-36 w-full rounded-xl border border-[#a8bf8d] p-4 text-sm outline-none focus:ring-2 focus:ring-[#8dad6c]"
                    placeholder={`Paste ${lesson} materials...`}
                    value={lessonTexts[lesson] || ""}
                    onChange={(e) =>
                      setLessonTexts((prev) => ({
                        ...prev,
                        [lesson]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addAllMaterials}
              disabled={!hasMaterialsToAdd || !date}
              className="mt-5 w-full rounded-xl bg-[#5f854b] p-3 font-bold text-white hover:bg-[#4f7240] disabled:opacity-40"
            >
              Add All Materials to Checklist
            </button>
          </div>

          <div
            ref={checklistRef}
            className="print-section rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold font-['Cormorant_Garamond']">
                  2. Crate Checklist
                </h2>

                <p className="text-[#6f675f]">
                  {classroom} • {unit} • {week}
                </p>
              </div>

              <div className="flex items-center gap-3 no-print export-hide">
                <button
                  onClick={exportPDF}
                  disabled={items.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-[#e8f0dc] px-4 py-2 font-semibold text-[#48663c] hover:bg-[#dfead0] disabled:opacity-40"
                >
                  <FileDown size={18} />
                  Export PDF
                </button>

                <button
                  onClick={() => window.print()}
                  disabled={items.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-[#b9c9ad] px-4 py-2 font-semibold text-white hover:bg-[#a7bb99] disabled:opacity-40"
                >
                  <Printer size={18} />
                  Print
                </button>

                <button
                  onClick={() => setItems([])}
                  className="rounded-xl border border-[#eadfce] px-4 py-2 hover:bg-[#f8f3ea]"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="min-h-72 rounded-xl border border-dashed border-[#dfcdb7] p-5 print:border-0 print:p-0">
              {items.length === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center text-center no-print">
                  <img
                    src={clipboardImage}
                    alt="Clipboard Preview"
                    className="mb-6 w-72 object-contain"
                  />

                  <p className="text-3xl font-bold text-[#7a6f63] font-['Cormorant_Garamond']">
                    Your crate list will appear here
                  </p>

                  <p className="mt-1 text-[#9b9187]">
                    Add materials to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 print:space-y-3">
                  {Object.entries(groupedByDay).map(([groupName, dayItems]) => (
                    <div key={groupName}>
                      <h3 className="mb-2 text-2xl font-bold text-[#496b3f] font-['Cormorant_Garamond']">
                        {groupName}
                      </h3>

                      <div className="space-y-2 print:space-y-1">
                        {dayItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg bg-[#fbf8f1] p-3 print:bg-white print:p-1"
                          >
                            <label className="flex items-center gap-3">
                              <input type="checkbox" />

                              <span>
                                <strong>{item.lesson}:</strong> {item.material}
                              </span>
                            </label>

                            <div className="flex items-center gap-3 no-print">
                              <button
                                onClick={() => ignoreMaterial(item.material)}
                                className="text-sm font-medium text-[#9a5b42] hover:underline"
                              >
                                Ignore
                              </button>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-sm text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {ignoredMaterials.length > 0 && (
              <div className="mt-5 rounded-xl bg-[#fff7ef] p-4 text-sm text-[#8a6048] no-print">
                <p className="mb-2 font-semibold">Ignored Materials</p>

                <div className="flex flex-wrap gap-2">
                  {ignoredMaterials.map((material) => (
                    <span
                      key={material}
                      className="rounded-full bg-[#fde8dd] px-3 py-1 capitalize"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
