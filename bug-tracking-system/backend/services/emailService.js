const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();

    if (!smtpUser || !smtpPass) {
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendTicketAssignmentEmail(ticket, assignedUser, assigner) {
    if (!this.transporter) return;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: assignedUser.email,
      subject: `New Ticket Assignment: ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BugTracker</h1>
            <p style="color: white; margin: 5px 0;">Issue Management System</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">🎯 New Ticket Assigned to You</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">${ticket.title}</h3>
              <p style="color: #666; line-height: 1.6;">${ticket.description}</p>
              
              <div style="margin: 20px 0;">
                <p><strong>Priority:</strong> <span style="color: ${this.getPriorityColor(ticket.priority)}; text-transform: capitalize;">${ticket.priority}</span></p>
                <p><strong>Status:</strong> <span style="color: ${this.getStatusColor(ticket.status)}; text-transform: capitalize;">${ticket.status}</span></p>
                <p><strong>Project:</strong> ${ticket.project?.name || 'N/A'}</p>
                <p><strong>Assigned by:</strong> ${assigner.name}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/projects/${ticket.project?._id}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Ticket
                </a>
              </div>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated notification from BugTracker Issue Management System.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail for production
    }
  }

  async sendTicketUpdateEmail(ticket, updatedBy, changes) {
    if (!this.transporter) return;

    const recipients = [];
    
    if (ticket.assignedTo && ticket.assignedTo._id.toString() !== updatedBy._id.toString()) {
      recipients.push(ticket.assignedTo.email);
    }
    
    if (ticket.submitter && ticket.submitter._id.toString() !== updatedBy._id.toString()) {
      recipients.push(ticket.submitter.email);
    }

    if (recipients.length === 0) return;

    const changesList = Object.entries(changes)
      .map(([field, { old, new: newVal }]) => 
        `<li><strong>${this.formatFieldName(field)}:</strong> ${old} → ${newVal}</li>`
      ).join('');

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients,
      subject: `Ticket Updated: ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BugTracker</h1>
            <p style="color: white; margin: 5px 0;">Issue Management System</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">📝 Ticket Updated</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">${ticket.title}</h3>
              
              <div style="margin: 20px 0;">
                <p><strong>Updated by:</strong> ${updatedBy.name}</p>
                <p><strong>Changes made:</strong></p>
                <ul style="color: #666; line-height: 1.6;">
                  ${changesList}
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/projects/${ticket.project?._id}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Ticket
                </a>
              </div>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated notification from BugTracker Issue Management System.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Silent fail for production
    }
  }

  getPriorityColor(priority) {
    switch (priority?.toLowerCase()) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'open': return '#007bff';
      case 'in-progress': return '#fd7e14';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  }

  formatFieldName(field) {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}

module.exports = new EmailService();
