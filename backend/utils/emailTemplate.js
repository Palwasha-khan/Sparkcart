export const getOrderEmailTemplate = (order, isForAdmin = false) => {
    // Mapping item rows dynamically
    const itemRows = order.orderItems?.map(item => `
        <tr>
            <td style="padding: 12px 10px; font-size: 14px; border-bottom: 1px solid #f7f9fa; font-weight: 600; color: #1a1f36;">
                ${item.name}
            </td>
            <td style="padding: 12px 10px; font-size: 14px; border-bottom: 1px solid #f7f9fa; color: #4f566b; text-align: center;">
                ${item.quantity}
            </td>
            <td style="padding: 12px 10px; font-size: 14px; border-bottom: 1px solid #f7f9fa; text-align: right; font-weight: 600; color: #1a1f36;">
                PKR ${item.price}
            </td>
        </tr>
    `).join('');

    const titleText = isForAdmin ? "🚨 New Order Received!" : "✨ Order Confirmed!";
    const subtitleText = isForAdmin ? "A new order has been placed on SparkCart." : "Thank you for your purchase! Packed with love.";

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; }
            .main-card { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #b00667, #700240); padding: 35px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
            .content { padding: 30px 40px; }
            .order-meta { background-color: #fcf8fa; border-left: 4px solid #b00667; padding: 15px; margin-bottom: 25px; }
            .meta-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #b00667; margin-bottom: 15px; border-bottom: 1px #f1f1f1 solid; padding-bottom: 5px; }
            .item-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .item-table th { text-align: left; padding: 10px; font-size: 12px; color: #727c8e; border-bottom: 2px solid #f1f1f1; text-transform: uppercase; }
            .totals-section { width: 100%; margin-top: 15px; border-top: 2px solid #f1f1f1; padding-top: 15px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; color: #4f566b; }
            .total-row.grand { font-size: 18px; font-weight: 700; color: #b00667; border-top: 1px dashed #e3e8ee; margin-top: 10px; padding-top: 10px; }
            .address-box { background-color: #f8f9fa; border-radius: 8px; padding: 15px; font-size: 14px; color: #4f566b; }
            .footer { background-color: #f7f9fa; padding: 20px; text-align: center; font-size: 11px; color: #a3acb9; border-top: 1px solid #e3e8ee; }
        </style>
    </head>
    <body>
        <div class="main-card">
            <div class="header">
                <h1>${titleText}</h1>
                <p style="margin:5px 0 0 0; opacity:0.9; font-size:14px;">${subtitleText}</p>
            </div>
            <div class="content">
                <div class="order-meta">
                   <div class="meta-row"><strong>Order ID:</strong> <span>#${order._id || 'N/A'}</span></div>
                   <div class="meta-row">
                        <strong>Payment Method:</strong> 
                        <span style="color: #b00667; font-weight:bold;">${order.paymentMethod}</span>
                    </div>
                    <div class="meta-row">
                        <strong>Status:</strong> 
                        <span style="color: ${order.paymentMethod === 'COD' ? '#de350b' : '#00875a'}; font-weight:bold;">
                            ${order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Paid'}
                        </span>
                    </div>
  </div>

                <div class="section-title">Items Ordered</div>
                <table class="item-table">
                    <thead>
                        <tr>
                            <th style="width: 60%;">Item</th>
                            <th style="width: 15%; text-align: center;">Qty</th>
                            <th style="width: 25%; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                </table>

                <div class="totals-section">
                    <div class="total-row"><span>Items Subtotal:</span><span>PKR ${order.itemsPrice}</span></div>
                    <div class="total-row"><span>Shipping Charges:</span><span>PKR ${order.shippingAmount || 0}</span></div>
                    <div class="total-row"><span>Tax Amount:</span><span>PKR ${order.taxAmount || 0}</span></div>
                    <div class="total-row grand"><span>Grand Total:</span><span>PKR ${order.totalAmount}</span></div>
                </div>

                <div class="section-title" style="margin-top: 30px;">Shipping Details</div>
                <div class="address-box">
                    <strong>Address:</strong> ${order.shippingInfo?.address}, ${order.shippingInfo?.city}<br>
                    <strong>Contact Phone:</strong> ${order.shippingInfo?.phoneNo}
                </div>
            </div>
            <div class="footer">
                <p>This is an automated operational system email from SparkCart.</p>
                <p>&copy; 2026 Parlisa Sparkles. All Rights Reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};