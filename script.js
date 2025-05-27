function generateBarcode() {
  const data = document.getElementById("barcodeData").value.trim();
  const sanitizedData = data.replace(/[^A-Za-z0-9\-]/g, '');
  const customText = document.getElementById("customText").value.trim();

  if (!sanitizedData) {
    alert("바코드 데이터를 입력해주세요.");
    return;
  }

  try {
    // 웹용 SVG 바코드
    JsBarcode("#barcode", sanitizedData, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 18
    });

    // 인쇄용 Canvas 바코드
    const canvas = document.getElementById("printableBarcodeCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // 중복 제거
    JsBarcode(canvas, sanitizedData, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: false // 숫자는 div로 따로 출력
    });

    // 텍스트 처리
    const customTextDisplay = document.getElementById("customTextDisplay");
    if (sanitizedData.startsWith("182-RCRT1")) {
      customTextDisplay.textContent = "토트바코드";
    } else if (customText) {
      customTextDisplay.textContent = customText;
    } else {
      customTextDisplay.textContent = "";
    }

    document.getElementById("barcodeNumber").textContent = sanitizedData;
    document.getElementById("printButton").style.display = "inline-block";
  } catch (error) {
    console.error("바코드 생성 중 오류:", error);
    alert("바코드 생성 실패");
  }
}
