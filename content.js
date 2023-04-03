const devBox = document.createElement('div');
devBox.textContent = 'DEV Marker';
devBox.id = 'devEnvMarkerDevBox';
devBox.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 5px 10px;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            z-index: 9999;
            cursor: pointer;
            user-select: none;
            display: none;
          `;

const positions = [
  { corner: 'rightTop', top: '10px', right: '10px' },
  { corner: 'rightBottom', bottom: '10px', right: '10px' },
  { corner: 'leftBottom', bottom: '10px', left: '10px' },
  { corner: 'leftTop', top: '10px', left: '10px' },
];

let currentPositionIndex = 1;

function moveToNextPosition() {
    console.log('moveToNextPosition'); 
    currentPositionIndex = (currentPositionIndex + 1) % positions.length;
    const newPosition = positions[currentPositionIndex];
    devBox.style.top = newPosition.top ?? 'auto';
    devBox.style.bottom = newPosition.bottom ?? 'auto';
    devBox.style.right = newPosition.right ?? 'auto';
    devBox.style.left = newPosition.left ?? 'auto';
}

document.body.appendChild(devBox);
devBox.addEventListener('mouseover', moveToNextPosition);
        
