const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let color = { r: 0, g: 0, b: 0 };
    if (result) {
        color = { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
    }
    return color;
};

export { hexToRgb };
