/**
 * Generate HTML email template for student credentials
 */
export function generateStudentCredentialEmail(data: {
  name: string;
  studentId: string;
  batch: string;
  password: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Shah Sultan's IELTS Academy</title>
    <style type="text/css">
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
        table { border-collapse: collapse; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background-color: #001f3f; padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 10px 0 0; font-size: 28px; font-weight: bold; }
        .header p { color: #ffd700; margin: 10px 0 0; font-size: 16px; }
        .logo { display: block; margin: 30px auto; max-width: 180px; height: auto; }
        .content { padding: 0 30px 40px; color: #333333; }
        .section-title { font-size: 20px; color: #001f3f; margin: 30px 0 15px; border-bottom: 3px solid #ffd700; padding-bottom: 8px; display: inline-block; }
        .details-table { width: 100%; margin: 20px 0; }
        .details-table td { padding: 12px 0; font-size: 16px; }
        .label { font-weight: bold; color: #001f3f; width: 140px; }
        .value { color: #333333; }
        .portal-link { display: inline-block; background-color: #ffd700; color: #001f3f; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-size: 17px; }
        .dashboard-list { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd700; }
        .dashboard-list li { margin: 12px 0; font-size: 16px; }
        .note { font-style: italic; color: #e74c3c; margin: 15px 0; font-size: 15px; }
        .footer { background-color: #001f3f; color: #ffffff; padding: 30px 20px; text-align: center; font-size: 14px; }
        .footer a { color: #ffd700; text-decoration: none; }
        .confidential { font-size: 12px; color: #999999; text-align: center; margin: 20px 0; }
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0; }
            .content { padding: 0 20px 30px; }
            .portal-link { padding: 12px 24px; font-size: 16px; }
            .logo { max-width: 150px; margin: 25px auto; }
        }
    </style>
</head>
<body>
    <center>
        <table class="container" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="header">
                    <h1>Shah Sultan's IELTS Academy</h1>
                    <p>Your Trusted Destination for Mastering English & Achieving IELTS Goals</p>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <!-- Logo placed here, before Student Details -->
                    <img src="https://i.ibb.co/spVJmgvt/Main-Logo.png" alt="Shah Sultan's IELTS Academy Logo" class="logo" />

                    <h2 class="section-title">Student Details</h2>
                    <table class="details-table">
                        <tr>
                            <td class="label">Name</td>
                            <td class="value">: ${data.name}</td>
                        </tr>
                        <tr>
                            <td class="label">Student ID</td>
                            <td class="value">: ${data.studentId}</td>
                        </tr>
                        <tr>
                            <td class="label">Batch</td>
                            <td class="value">: ${data.batch}</td>
                        </tr>
                    </table>

                    <h2 class="section-title">Login Details</h2>
                    <table class="details-table">
                        <tr>
                            <td class="label">Portal URL</td>
                            <td class="value">: <a href="https://shah-sultan-s-ielts-academy.web.app/" style="color: #001f3f; font-weight: bold; text-decoration: none;">https://shah-sultan-s-ielts-academy.web.app/</a></td>
                        </tr>
                        <tr>
                            <td class="label">Student ID</td>
                            <td class="value">: ${data.studentId}</td>
                        </tr>
                        <tr>
                            <td class="label">Password</td>
                            <td class="value">: ${data.password}</td>
                        </tr>
                    </table>
                    <p class="note">* Change your password after first login.</p>

                    <div style="text-align: center;">
                        <a href="https://shah-sultan-s-ielts-academy.web.app/" class="portal-link">Access Student Portal Now</a>
                    </div>

                    <h2 class="section-title">Dashboard Overview</h2>
                    <ul class="dashboard-list">
                        <li>Take IELTS mock and practice tests</li>
                        <li>View band scores and results</li>
                        <li>Track progress by skill</li>
                    </ul>

                    <h2 class="section-title">Office Hours</h2>
                    <table class="details-table">
                        <tr>
                            <td class="label">Mon - Fri</td>
                            <td class="value">: 9:00 AM - 6:00 PM</td>
                        </tr>
                        <tr>
                            <td class="label">Saturday</td>
                            <td class="value">: 10:00 AM - 4:00 PM</td>
                        </tr>
                        <tr>
                            <td class="label">Sunday</td>
                            <td class="value">: Closed</td>
                        </tr>
                    </table>

                    <h2 class="section-title">Contact</h2>
                    <table class="details-table">
                        <tr>
                            <td class="label">Main Branch</td>
                            <td class="value">: R.B. Complex, 6th Floor, East Zindabazar, Sylhet</td>
                        </tr>
                        <tr>
                            <td class="label">Jalalpur</td>
                            <td class="value">: Mosahid Plaza, 2nd Floor, College Road</td>
                        </tr>
                        <tr>
                            <td class="label">Phone</td>
                            <td class="value">: +880 1646-882798 | +880 1337-993522</td>
                        </tr>
                        <tr>
                            <td class="label">Support Email</td>
                            <td class="value">: shahsultans.ieltsacademy02@gmail.com</td>
                        </tr>
                    </table>

                    <p style="margin-top: 30px; font-size: 15px; line-height: 1.6; text-align: center;">
                        We are Shah Sultan's IELTS Academy, committed to helping students achieve their target band scores through personalized coaching and structured learning programs.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>&copy; 2025 Shah Sultan's IELTS Academy. All rights reserved.</p>
                    <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
                </td>
            </tr>
        </table>
        <p class="confidential">Confidential document. Do not share login credentials.</p>
    </center>
</body>
</html>`;
}
