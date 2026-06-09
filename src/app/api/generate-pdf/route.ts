import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { verifyAuth } from "@/lib/apiAuth";

const LINE_HEIGHT_MULTIPLIER = 1.5;

export async function POST(req: Request) {
  try {
    const { 
      roadmap, 
      title, 
      goal, 
      confidenceScore, 
      curriculum, 
      habits, 
      network,
      createdAt 
    } = await req.json();
    const { uid } = await verifyAuth(req);

    if (!roadmap || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const maxY = pageHeight - margin;
    let y = 20;

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text(title, pageWidth / 2, 25, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    const goalText = `Goal: ${goal || "Professional Growth"}`;
    const goalLines = doc.splitTextToSize(goalText, pageWidth - 40);
    doc.text(goalLines, pageWidth / 2, 35, { align: "center" });

    y = 55;
    doc.setTextColor(0, 0, 0);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(margin, y - 5, 50, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(`Confidence: ${confidenceScore || "N/A"}%`, margin + 5, y + 2);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    const stepsText = `${roadmap.length} Steps`;
    doc.text(stepsText, margin + 60, y);
    
    y += 20;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Career Roadmap", margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const baseLineHeight = 11 * LINE_HEIGHT_MULTIPLIER;
    
    for (const step of roadmap) {
      if (y > maxY - 40) {
        doc.addPage();
        y = margin;
      }

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(245, 158, 11);
      doc.text(step.tag.toUpperCase(), margin + 5, y + 1);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const lineHeight12 = 12 * LINE_HEIGHT_MULTIPLIER;
      const titleLines = doc.splitTextToSize(step.title, contentWidth - 40);
      doc.text(titleLines, margin + 35, y + 1);
      y += titleLines.length * lineHeight12;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lineHeight10 = 10 * LINE_HEIGHT_MULTIPLIER;
      const descLines = doc.splitTextToSize(step.desc, contentWidth - 10);
      doc.text(descLines, margin + 5, y);
      y += descLines.length * lineHeight10 + 3;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      const resultLines = doc.splitTextToSize(`✓ ${step.result}`, contentWidth - 10);
      doc.text(resultLines, margin + 5, y);
      y += resultLines.length * lineHeight10 + 5;
      doc.setTextColor(0, 0, 0);
    }

    y += 10;

    if (curriculum && curriculum.length > 0) {
      if (y > maxY - 30) {
        doc.addPage();
        y = margin;
      }
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Learning Path", margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lineHeight10 = 10 * LINE_HEIGHT_MULTIPLIER;
      
      for (const item of curriculum) {
        if (y > maxY - 30) {
          doc.addPage();
          y = margin;
        }
        
        doc.setFillColor(255, 251, 235);
        const courseLines = doc.splitTextToSize(item.course, contentWidth - 10);
        const itemHeight = 4 + (courseLines.length * lineHeight10) + 6;
        doc.roundedRect(margin, y - 3, contentWidth, itemHeight, 1, 1, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.text(courseLines, margin + 5, y + 2);
        y += courseLines.length * lineHeight10 + 3;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const providerLines = doc.splitTextToSize(`Provider: ${item.provider}`, contentWidth - 10);
        doc.text(providerLines, margin + 5, y + 2);
        y += providerLines.length * lineHeight10 + 8;
        doc.setTextColor(0, 0, 0);
      }
      
      y += 5;
    }

    if (habits && habits.length > 0) {
      if (y > maxY - 30) {
        doc.addPage();
        y = margin;
      }
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Key Habits", margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lineHeight10 = 10 * LINE_HEIGHT_MULTIPLIER;
      
      for (const habit of habits) {
        if (y > maxY - 30) {
          doc.addPage();
          y = margin;
        }
        
        doc.setFillColor(236, 253, 243);
        const habitLines = doc.splitTextToSize(`${habit.icon} ${habit.title}`, contentWidth - 10);
        const descLines = doc.splitTextToSize(habit.desc, contentWidth - 10);
        const habitHeight = 4 + (habitLines.length * lineHeight10) + (descLines.length * lineHeight10) + 3;
        doc.roundedRect(margin, y - 3, contentWidth, habitHeight, 1, 1, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.text(habitLines, margin + 5, y + 2);
        y += habitLines.length * lineHeight10 + 2;
        
        doc.setFont("helvetica", "normal");
        doc.text(descLines, margin + 5, y);
        y += descLines.length * lineHeight10 + 8;
      }
      
      y += 5;
    }

    if (network && network.length > 0) {
      if (y > maxY - 30) {
        doc.addPage();
        y = margin;
      }
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Network Recommendations", margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lineHeight10 = 10 * LINE_HEIGHT_MULTIPLIER;
      
      for (const person of network) {
        if (y > maxY - 30) {
          doc.addPage();
          y = margin;
        }
        
        doc.setFillColor(248, 250, 252);
        const nameLines = doc.splitTextToSize(`${person.name} (${person.type})`, contentWidth - 10);
        const roleLines = doc.splitTextToSize(person.role, contentWidth - 10);
        const reasonLines = doc.splitTextToSize(person.reason, contentWidth - 10);
        const personHeight = 4 + (nameLines.length * lineHeight10) + (roleLines.length * lineHeight10) + (reasonLines.length * lineHeight10) + 3;
        doc.roundedRect(margin, y - 3, contentWidth, personHeight, 1, 1, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.text(nameLines, margin + 5, y + 2);
        y += nameLines.length * lineHeight10 + 2;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(roleLines, margin + 5, y + 2);
        y += roleLines.length * lineHeight10 + 2;
        
        doc.setTextColor(0, 0, 0);
        doc.text(reasonLines, margin + 5, y + 2);
        y += reasonLines.length * lineHeight10 + 8;
      }
    }

    y = maxY - 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const dateStr = createdAt ? new Date(createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    doc.text(`Generated on ${dateStr} by Apprena - AI-Powered Career Roadmaps`, pageWidth / 2, y, { align: "center" });

    const pdfBase64 = doc.output("datauristring");

    return NextResponse.json({ pdf: pdfBase64, confidenceScore });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}