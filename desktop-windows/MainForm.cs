using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace QuanLyChuNhiemDesktop
{
    public class MainForm : Form
    {
        private WebView2 webView;

        public MainForm()
        {
            InitializeComponent();
            InitializeAsync();
        }

        private void InitializeComponent()
        {
            this.Text = "Nền tảng Quản lý Chủ nhiệm & Phối hợp Giáo dục Toàn trường (2026)";
            this.Width = 1440;
            this.Height = 900;
            this.MinimumSize = new Size(1024, 700);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.WindowState = FormWindowState.Normal;
            this.BackColor = Color.FromArgb(248, 250, 252);

            webView = new WebView2
            {
                Dock = DockStyle.Fill
            };
            this.Controls.Add(webView);
        }

        private async void InitializeAsync()
        {
            try
            {
                var userDataFolder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "QuanLyChuNhiem2026",
                    "WebView2Data"
                );
                Directory.CreateDirectory(userDataFolder);

                var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
                await webView.EnsureCoreWebView2Async(env);

                webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
                webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
                webView.CoreWebView2.Settings.IsZoomControlEnabled = true;

                string distPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dist");
                if (!Directory.Exists(distPath))
                {
                    distPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "dist"));
                }

                if (Directory.Exists(distPath))
                {
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "chunhiem.local",
                        distPath,
                        CoreWebView2HostResourceAccessKind.Allow
                    );
                    webView.CoreWebView2.Navigate("https://chunhiem.local/index.html");
                }
                else
                {
                    webView.CoreWebView2.NavigateToString(@"
                        <html>
                            <body style='font-family: sans-serif; text-align: center; padding: 50px;'>
                                <h2>Nền tảng Quản lý Chủ nhiệm 2026</h2>
                                <p>Đang tải ứng dụng...</p>
                            </body>
                        </html>
                    ");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Lỗi khởi tạo WebView: {ex.Message}", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
