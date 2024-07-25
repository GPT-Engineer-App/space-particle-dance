import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PARTICLE_COUNT = 100;

const Particle = (x, y, speed) => ({ x, y, speed, angle: Math.random() * Math.PI * 2 });

const Index = () => {
  const [particles, setParticles] = useState([]);
  const [maxSpeed, setMaxSpeed] = useState(2);
  const canvasRef = useRef(null);

  useEffect(() => {
    initParticles();
  }, []);

  const initParticles = () => {
    const newParticles = Array.from({ length: PARTICLE_COUNT }, () =>
      Particle(
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        Math.random() * maxSpeed
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
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [particles]);

  const handleSpeedChange = (newSpeed) => {
    setMaxSpeed(newSpeed[0]);
    setParticles(prevParticles =>
      prevParticles.map(p => ({ ...p, speed: Math.random() * newSpeed[0] }))
    );
  };

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
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Max Speed:</span>
            <Slider
              value={[maxSpeed]}
              onValueChange={handleSpeedChange}
              max={10}
              step={0.1}
              className="w-64"
            />
            <span className="text-sm">{maxSpeed.toFixed(1)}</span>
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