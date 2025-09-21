import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const Timetable = () => {
  const timetableData = [
    { day: "Monday", time: "9:00 AM - 11:00 AM", subject: "Computer Networks" },
    {
      day: "Tuesday",
      time: "10:00 AM - 12:00 PM",
      subject: "Database Management Systems",
    },
    {
      day: "Wednesday",
      time: "1:00 PM - 3:00 PM",
      subject: "Operating Systems",
    },
    {
      day: "Thursday",
      time: "9:00 AM - 11:00 AM",
      subject: "Software Engineering",
    },
    {
      day: "Friday",
      time: "11:00 AM - 1:00 PM",
      subject: "Web Technologies",
    },
  ];

  const handleDownload = (format: "pdf" | "excel") => {
    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("IT-B - Weekly Schedule", 20, 10);
      let y = 20;
      timetableData.forEach((row) => {
        doc.text(`${row.day}: ${row.time} - ${row.subject}`, 20, y);
        y += 10;
      });
      doc.save("timetable.pdf");
    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(timetableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
      XLSX.writeFile(workbook, "timetable.xlsx");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Download</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDownload("pdf")}>
              Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload("excel")}>
              Download as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">IT-B - Weekly Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timetableData.map((item) => (
            <div key={item.day} className="p-4 border rounded-md">
              <h3 className="font-bold text-lg">{item.day}</h3>
              <p>{item.time}</p>
              <p>{item.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
