
export default function ControlPanel({ settings, setSettings }) {

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }

    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'rgba(149, 150, 113, 0.95)',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            minWidth: '200px'
        }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Settings</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '1rem'
                }}>
                    Street Color
                </label>
                <input type="color"
                    value={settings.streetColor}
                    onChange={(e) => handleChange('streetColor', e.target.value)}
                    style={{
                        width: '100%',
                        height: '32px',
                        cursor: 'pointer'
                    }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{
                    display: 'block'
                    , marginBlock: '4px',
                    fontSize: '1rem'
                }}>BackGround Color</label>
                <input type="color"
                    value={settings.bgColor}
                    onChange={(e) => handleChange('bgColor', e.target.value)}
                    style={{
                        width: "100%",
                        height: '32px',
                        cursor: 'pointer'
                    }} />


                <button onClick={() => handleChange('bgColor', 'transparent')}
                    style={{
                        marginTop: '4px',
                        padding: '4px 6px',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}>
                    Transparent
                </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '1rem'
                }}>Line width: {settings.lineWidth}</label>
                <input type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={settings.lineWidth}
                    onChange={(e) => handleChange('lineWidth', parseFloat(e.target.value))}
                    style={{
                        width: '100%'
                    }}
                />
            </div>
            <div style={{ display: "flex", gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                <button className="button">PNG</button>
                <button className="button">SVG</button>
            </div>
        </div>
    )
}