import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default async function downloadComponentInPDF(Component) {
  const scale = 3; // 增加此值以提高解析度
  await html2canvas(Component, { scale }).then((canvas) => {
    const componentWidth = Component.offsetWidth * scale;
    const componentHeight = Component.offsetHeight * scale;

    const orientation = componentWidth >= componentHeight ? 'l' : 'p';

    // 使用 JPEG 格式，質量設為 0.7
    const imgData = canvas.toDataURL('image/jpeg', 0.7);
    const pdf = new jsPDF({
      orientation,
      unit: 'px'
    });

    pdf.internal.pageSize.width = componentWidth;
    pdf.internal.pageSize.height = componentHeight;

    pdf.addImage(imgData, 'JPEG', 0, 0, componentWidth, componentHeight);
    
    pdf.save('download.pdf');
  });
}