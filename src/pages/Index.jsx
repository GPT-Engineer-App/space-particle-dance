import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Particle = (x, y, speed, size) => ({ x, y, speed, size, angle: Math.random() * Math.PI * 2 });

const Index = () => {
  const [particles, setParticles] = useState([]);
  const [particleCount, setParticleCount] = useState(100);
  const [minSpeed, setMinSpeed] = useState(0.5);
  const [maxSpeed, setMaxSpeed] = useState(2);
  const [minSize, setMinSize] = useState(1);
  const [maxSize, setMaxSize] = useState(5);
  const canvasRef = useRef(null);

  useEffect(() => {
    initParticles();
  }, [particleCount, minSpeed, maxSpeed, minSize, maxSize]);

  const initParticles = () => {
    const newParticles = Array.from({ length: particleCount }, () =>
      Particle(
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        minSpeed + Math.random() * (maxSpeed - minSpeed),
        minSize + Math.random() * (maxSize - minSize)
      )
    );
    setParticles(newParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

      particles.forEach(particle => {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        if (particle.x < 0) particle.x = CANVAS_WIDTH;
        if (particle.x > CANVAS_WIDTH) particle.x = 0;
        if (particle.y < 0) particle.y = CANVAS_HEIGHT;
        if (particle.y > CANVAS_HEIGHT) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [particles]);

  const SliderControl = ({ label, value, onChange, min, max, step }) => (
    <div className="flex flex-col space-y-2">
      <Label>{label}: {value.toFixed(1)}</Label>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Particle Motion Visualizer</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="bg-gray-900 rounded-lg mx-auto"
          />
          <div className="grid grid-cols-2 gap-4">
            <SliderControl
              label="Particle Count"
              value={particleCount}
              onChange={setParticleCount}
              min={10}
              max={500}
              step={10}
            />
            <SliderControl
              label="Min Speed"
              value={minSpeed}
              onChange={setMinSpeed}
              min={0.1}
              max={maxSpeed}
              step={0.1}
            />
            <SliderControl
              label="Max Speed"
              value={maxSpeed}
              onChange={setMaxSpeed}
              min={minSpeed}
              max={10}
              step={0.1}
            />
            <SliderControl
              label="Min Size"
              value={minSize}
              onChange={setMinSize}
              min={1}
              max={maxSize}
              step={0.5}
            />
            <SliderControl
              label="Max Size"
              value={maxSize}
              onChange={setMaxSize}
              min={minSize}
              max={10}
              step={0.5}
            />
          </div>
          <Button onClick={initParticles} className="w-full">
            Reset Particles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;