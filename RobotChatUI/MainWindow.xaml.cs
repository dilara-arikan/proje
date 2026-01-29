using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RobotChatUI.Services;
using RobotChatUI.Services.Chat;
using RobotChatUI.Services.RobotConnectors;

namespace RobotChatUI
{
    public partial class MainWindow : Window
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly IRobotConnector _robotConnector;
        private readonly ChatService _chatService;
        private readonly QrDetectionService _qrService;

        public MainWindow()
        {
            InitializeComponent();

            // Dependency Injection Setup
            var services = new ServiceCollection();
            
            services.AddLogging(builder =>
            {
                builder.AddConsole();
                builder.AddDebug();
            });

            services.AddSingleton<RobotConnectionConfig>(new RobotConnectionConfig
            {
                RosDomainId = "0",
                RmwImplementation = "rmw_cyclonedds_cpp",
                RosNamespace = "/robot",
                TimeoutMs = 5000,
                EnableSecurity = true
            });

            services.AddSingleton<ChatService>();
            services.AddSingleton<QrDetectionService>();
            services.AddSingleton<Ros2Connector>();
            services.AddSingleton<IRobotConnector>(sp => sp.GetRequiredService<Ros2Connector>());

            _serviceProvider = services.BuildServiceProvider();

            // Get services
            var loggerFactory = _serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger<MainWindow>();

            _chatService = _serviceProvider.GetRequiredService<ChatService>();
            _qrService = _serviceProvider.GetRequiredService<QrDetectionService>();
            _robotConnector = _serviceProvider.GetRequiredService<IRobotConnector>();

            // Hook up events
            _robotConnector.TelemetryReceived += OnTelemetryReceived;
            _robotConnector.QrDetectionReceived += OnQrDetectionReceived;
            _robotConnector.MissionStatusChanged += OnMissionStatusChanged;
            _robotConnector.ErrorOccurred += OnErrorOccurred;

            _qrService.QrDetected += OnQrDetected;
            _chatService.MessageReceived += OnChatMessageReceived;

            logger.LogInformation("RobotChatUI initialized");
            _chatService.LogSystemMessage("Application started - Connecting to robot...");

            Loaded += async (s, e) => await ConnectToRobotAsync();
        }

        /// <summary>
        /// Robot'a bağlan
        /// </summary>
        private async System.Threading.Tasks.Task ConnectToRobotAsync()
        {
            try
            {
                _chatService.LogSystemMessage("Attempting to connect to ROS2 robot...");
                await _robotConnector.ConnectAsync();
                _chatService.LogSystemMessage("Connected to robot successfully!", "SUCCESS");
            }
            catch (Exception ex)
            {
                _chatService.LogSystemMessage($"Connection failed: {ex.Message}", "ERROR");
            }
        }

        private void OnTelemetryReceived(object? sender, RobotTelemetryEventArgs e)
        {
            Dispatcher.Invoke(() =>
            {
                // Update UI with telemetry
                // (Gerçek uygulamada: robot state, battery, position güncellenecek)
            });
        }

        private void OnQrDetectionReceived(object? sender, QrDetectionEventArgs e)
        {
            Dispatcher.Invoke(() =>
            {
                _chatService.LogQrDetection(e.Detection.QrCode, e.Detection.Location);
            });
        }

        private void OnMissionStatusChanged(object? sender, MissionStatusEventArgs e)
        {
            Dispatcher.Invoke(() =>
            {
                _chatService.LogMissionStatus(e.Task.Id, e.Task.Status, e.StatusMessage);
            });
        }

        private void OnErrorOccurred(object? sender, ErrorEventArgs e)
        {
            Dispatcher.Invoke(() =>
            {
                _chatService.LogSystemMessage(e.ErrorMessage, "ERROR");
            });
        }

        private void OnQrDetected(object? sender, QrDetection detection)
        {
            Dispatcher.Invoke(() =>
            {
                _chatService.LogQrDetection(detection.QrCode, detection.Location);
            });
        }

        private void OnChatMessageReceived(object? sender, ChatMessage message)
        {
            Dispatcher.Invoke(() =>
            {
                // Add message to UI chat list
                // (Gerçek uygulamada: ListBox'a ekleme yapılacak)
            });
        }

        protected override void OnClosed(EventArgs e)
        {
            base.OnClosed(e);
            _robotConnector?.Dispose();
            _serviceProvider?.Dispose();
        }
    }
}
