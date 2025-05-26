function generateBarcode() {
    const data = document.getElementById("barcodeData").value.trim();  // 사용자 입력값 받기

    // 입력값이 비어있으면 경고 메시지
    if (!data) {
        alert("바코드 데이터를 입력해주세요.");
        return;
    }

    // 입력값에 특수문자나 공백이 포함되면 제거 (숫자와 알파벳만 허용)
    const sanitizedData = data.replace(/[^A-Za-z0-9]/g, '');  // 알파벳과 숫자만 허용

    // 만약 특수문자나 공백을 모두 제거한 결과 값이 비어있으면
    if (!sanitizedData) {
        alert("바코드 데이터에는 알파벳과 숫자만 입력할 수 있습니다.");
        return;
    }

    console.log("바코드 생성 중:", sanitizedData);  // 디버깅용 로그

    try {
        // 바코드 생성 (Code128 형식 사용)
        JsBarcode("#barcode", sanitizedData, {
            format: "CODE128",  // CODE128 바코드 형식 사용
            width: 2,           // 바코드 선의 두께
            height: 100,        // 바코드의 높이
            displayValue: true,  // 바코드 숫자 아래에 값 표시
        });

        // 바코드 숫자 아래에 표시할 숫자 값 업데이트
        const barcodeNumber = document.getElementById("barcodeNumber");
        barcodeNumber.textContent = sanitizedData;

        // 사용자 입력 내용 (추가 텍스트)
        const customText = document.getElementById("customText").value.trim();
        if (customText) {
            barcodeNumber.textContent += ` - ${customText}`; // 바코드 숫자 아래 텍스트 추가
        }

    } catch (error) {
        // 오류 처리
        console.error("바코드 생성 중 오류 발생:", error);
        alert("바코드 생성에 실패했습니다. 입력값을 확인해주세요.");
    }
}

// 바코드를 PNG로 다운로드할 수 있게 하는 함수
function downloadBarcode() {
    const svg = document.getElementById("barcode");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // SVG 데이터를 캔버스에 그리기 위해 먼저 로드
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    
    img.onload = function() {
        // 캔버스 크기를 바코드 이미지 크기에 맞추기
        canvas.width = img.width;
        canvas.height = img.height + 150;  // 텍스트와 바코드 숫자가 추가된 높이 (150px)

        // 바코드를 그리기 전에 먼저 텍스트를 올려서 바코드 아래에 텍스트 공간을 만들기
        const customText = document.getElementById("customText").value.trim();
        const barcodeNumber = document.getElementById("barcodeNumber").textContent;
        
        // 텍스트 스타일 설정 (배경을 하얀색으로 설정)
        ctx.fillStyle = "#fff";  // 텍스트 배경 (하얀색)
        ctx.fillRect(0, 0, canvas.width, 60);  // 텍스트 배경 (텍스트 위에 배경 그리기)

        // 텍스트 스타일 설정
        ctx.fillStyle = "#000";  // 텍스트 색상 (검정색)
        ctx.font = "32px Arial";  // 폰트 크기 32px로 설정 (기존의 16px보다 두 배 큼)
        ctx.textAlign = "center";  // 텍스트를 수평 중앙에 배치

        // 사용자가 입력한 텍스트를 바코드 이미지 위에 배치
        if (customText) {
            // 텍스트의 수직 위치를 조정하여 가운데로 맞추기
            const textYPosition = 30;  // 바코드 이미지 위에 표시될 텍스트의 Y 위치
            ctx.fillText(customText, canvas.width / 2, textYPosition); // 바코드 위에 내용 표시
        }

        // 바코드 이미지 그리기
        ctx.drawImage(img, 0, 60);  // 바코드를 아래쪽에 배치 (텍스트 위에 배치됨)

        // 바코드 숫자 텍스트
        ctx.fillStyle = "#000";  // 바코드 숫자 텍스트 색상 (검정색)
        ctx.font = "20px Arial";
        ctx.fillText(barcodeNumber, canvas.width / 2, img.height + 90);  // 바코드 숫자 아래에 배치

        // PNG로 변환 후 다운로드
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "barcode_with_text.png";
        link.click();
    };
    
    img.src = url;
}
