import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#e4c484', // Wood color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '110px', // rounded app icon
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        {/* Draw grid lines */}
        <div style={{ position: 'absolute', width: '80%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[...Array(5)].map((_, i) => (
            <div key={`h-${i}`} style={{ width: '100%', height: '4px', background: '#5b413c', opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ position: 'absolute', width: '80%', height: '80%', display: 'flex', justifyContent: 'space-between' }}>
          {[...Array(5)].map((_, i) => (
            <div key={`v-${i}`} style={{ width: '4px', height: '100%', background: '#5b413c', opacity: 0.8 }} />
          ))}
        </div>
        
        {/* Black Stone */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '30%',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #444, #111)',
          borderRadius: '50%',
          boxShadow: '5px 10px 15px rgba(0,0,0,0.5)',
        }} />
        <div style={{
          position: 'absolute',
          top: '34%',
          left: '34%',
          width: '30px',
          height: '30px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          filter: 'blur(4px)'
        }} />

        {/* White Stone */}
        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '30%',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #fff, #ddd)',
          borderRadius: '50%',
          boxShadow: '5px 10px 15px rgba(0,0,0,0.4)',
        }} />
      </div>
    ),
    {
      ...size,
    }
  )
}
