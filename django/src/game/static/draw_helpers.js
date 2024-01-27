export function drawRectRounded(ctx, x, y, w, h, cornerRadius) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + cornerRadius, y - h / 2);
    ctx.lineTo(x + w / 2 - cornerRadius, y - h / 2);
    ctx.arcTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + cornerRadius, cornerRadius);
    ctx.lineTo(x + w / 2, y + h / 2 - cornerRadius);
    ctx.arcTo(x + w / 2, y + h / 2, x + w / 2 - cornerRadius, y + h / 2, cornerRadius);
    ctx.lineTo(x - w / 2 + cornerRadius, y + h / 2);
    ctx.arcTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - cornerRadius, cornerRadius);
    ctx.lineTo(x - w / 2, y - h / 2 + cornerRadius);
    ctx.arcTo(x - w / 2, y - h / 2, x - w / 2 + cornerRadius, y - h / 2, cornerRadius);
    ctx.fill();
    ctx.closePath();
}

export function drawBorderRounded(ctx, x, y, w, h, cornerRadius) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + cornerRadius, y - h / 2);
    ctx.lineTo(x + w / 2 - cornerRadius, y - h / 2);
    ctx.arcTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + cornerRadius, cornerRadius);
    ctx.lineTo(x + w / 2, y + h / 2 - cornerRadius);
    ctx.arcTo(x + w / 2, y + h / 2, x + w / 2 - cornerRadius, y + h / 2, cornerRadius);
    ctx.lineTo(x - w / 2 + cornerRadius, y + h / 2);
    ctx.arcTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - cornerRadius, cornerRadius);
    ctx.lineTo(x - w / 2, y - h / 2 + cornerRadius);
    ctx.arcTo(x - w / 2, y - h / 2, x - w / 2 + cornerRadius, y - h / 2, cornerRadius);
    ctx.style = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}