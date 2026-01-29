using System.Windows;

namespace RobotChatUI
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            // Dependency Injection ve servislerin kurulması MainWindow'da yapılacak
        }
    }
}
