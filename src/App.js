import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { Sidebar } from './components/ui/sidebar';
import { SidebarProvider } from './sidebar-context';
import saveAs from 'file-saver';
import { getColorFromCategory, categorizeText, colorCategories, adjustColor } from './utils/colorUtils';
import './styles/colorList.css';


const generateImage = (inputText) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');


  const category = categorizeText(inputText);
  const backgroundColor = getColorFromCategory(category, true);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  for (let i = 0; i < 10; i++) {
    const size = Math.random() * 150;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);

    // ランダムに明るいか暗い色を選択
    const isLighter = Math.random() < 0.5;
    const shapeColor = adjustColor(getColorFromCategory(category), isLighter ? 40 : -40);

    ctx.fillStyle = shapeColor;
    ctx.beginPath();

    const shapeType = Math.random();
    if (shapeType < 0.33) {
      ctx.rect(x, y, size, size);
    } else if (shapeType < 0.66) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size / 2, y - Math.sqrt(3) / 2 * size);
      ctx.closePath();
    } else {
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    }

    ctx.fill();
  }

  return canvas.toDataURL();
};


export default function App() {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('title');
  const [showColorList, setShowColorList] = useState(false);


  const handleGenerate = () => {
    const image = generateImage(inputText);
    setGeneratedImage(image);
    setHistory([...history, { inputText, image }]);
    setView('generated');
  };


  const downloadImage = () => {
    saveAs(generatedImage, 'generated_image.png');
  };


  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <Button onClick={() => setView('title')}>タイトル画面</Button>
          <Button onClick={() => setView('generated')}>生成された画像</Button>
          <Button onClick={() => setView('history')}>履歴</Button>
          <Button onClick={() => setShowColorList(!showColorList)}>
            {showColorList ? '色言葉リストを隠す' : '色言葉リストを表示'}
          </Button>
        </Sidebar>
        <div className="flex-1 p-8">
          {view === 'title' && (
            <Card>
              <CardContent>
                <h1 className="text-2xl font-bold mb-4">幾何学的画像生成AI</h1>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="キーワードを入力"
                />
                <Button onClick={handleGenerate} className="mt-4">画像生成</Button>
              </CardContent>
            </Card>
          )}
          {view === 'generated' && generatedImage && (
            <div>
              <h2 className="text-xl mb-4">生成された画像</h2>
              <img src={generatedImage} alt="Generated" />
              <Button onClick={downloadImage} className="mt-4">画像をダウンロード</Button>
            </div>
          )}
          {view === 'history' && (
            <div>
              <h2 className="text-xl mb-4">生成履歴</h2>
              {history.map((item, index) => (
                <div key={index} className="mb-4">
                  <p>入力: {item.inputText}</p>
                  <img src={item.image} alt={`Generated ${index}`} className="w-32 h-32" />
                </div>
              ))}
            </div>
          )}
          {showColorList && (
            <div className="mt-8">
              <h2 className="text-xl mb-4">色言葉リスト</h2>
              {Object.entries(colorCategories).map(([color, data]) => (
                <div key={color} className="mb-4">
                  <strong>{color}</strong>: {Array.isArray(data) ? data.slice(1).join('、 ') : 'データなし'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}