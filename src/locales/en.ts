export const en: Record<string, string> = {
    // Common
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': '← Back',
    'common.quit': 'Quit',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.optional': 'optional',
    'common.skip': 'Skip',
    'common.networkError': 'Network error, please check your connection',
    'common.unknownError': 'An unknown error occurred',

    // Header
    'header.title': 'Portex',
    'header.loggedIn': 'Logged in',
    'header.notLoggedIn': 'Not logged in',

    // Footer
    'footer.hint': '↑↓ Navigate   Enter Confirm   Esc Back   Q Quit',

    // Hints
    'hint.login':           '  【Tab】switch field   【Enter】confirm',
    'hint.deploy':          '  【Enter】confirm   【Esc】back',
    'hint.publish':         '  【↑↓】scroll   【Enter】select   【Esc】back',
    'hint.newApp.form':     '  【Tab】next field   【Enter】confirm   【Esc】back',
    'hint.newApp.platform': '  【↑↓】select   【Enter】confirm   【Esc】back',
    'hint.newApp.done':     '  【Esc】back',
    'hint.appList':         '  【Tab】search   【P】platform   【←→】page   【Esc】back',
    'hint.link':            '  【↑↓】select   【←→】page   【Tab】search   【Enter】confirm   【Esc】back',
    'hint.bot.menu':        '  【↑↓】select   【Enter】confirm   【Esc】back',
    'hint.bot.form':        '  【Enter】confirm   【Esc】back',
    'hint.nav':             '  【↑↓】select   【Enter】confirm   【L】{lang}   【Q】quit',

    // Dashboard
    'dashboard.menu.deploy': 'Deploy App',
    'dashboard.menu.publish': 'Publish Version',
    'dashboard.menu.list': 'App List',
    'dashboard.menu.new': 'New App',
    'dashboard.menu.bot': 'Bot Settings',
    'dashboard.menu.logout': 'Logout',
    'dashboard.menu.quit': 'Quit',

    // Login
    'login.title': 'Login to Portex',
    'login.account': 'Account (email)',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.loggingIn': 'Logging in...',
    'login.success': 'Login successful!',
    'login.failed': 'Login failed',
    'login.tokenExpired': 'Token expired. Please log in again.',

    // Logout
    'logout.success': 'Logged out successfully',
    'logout.confirm': 'Are you sure you want to logout?',

    // New App
    'new.title': 'Create New App',
    'new.nameLabel': 'App name',
    'new.appName': 'App name (lowercase, numbers, underscores, 5-35 chars)',
    'new.descriptionLabel': 'Description (optional)',
    'new.appNameInvalid': 'Invalid: use lowercase letters, numbers, underscores, 5-35 characters',
    'new.platform': 'Select platform',
    'new.description': 'Description (optional, max 140 chars)',
    'new.descriptionTooLong': 'Description cannot exceed 140 characters',
    'new.creating': 'Creating app...',
    'new.success': 'App created successfully!',
    'new.configCreated': '.portex config file generated',
    'new.failed': 'Failed to create app',

    // Deploy
    'deploy.title': 'Deploy App',
    'deploy.appName': 'App name',
    'deploy.path': 'Build path (e.g. ./dist)',
    'deploy.description': 'Version description (optional)',
    'deploy.compressing': 'Compressing files...',
    'deploy.compressed': 'Compression complete',
    'deploy.gettingUrl': 'Getting upload URL...',
    'deploy.uploading': 'Uploading...',
    'deploy.success': 'Deploy successful!',
    'deploy.version': 'New version',
    'deploy.nextStep': "Run 'portex publish' to release this version",
    'deploy.failed': 'Deploy failed',
    'deploy.pathNotExist': 'Path does not exist',

    // Publish
    'publish.title': 'Publish Version',
    'publish.appName': 'App name',
    'publish.selectVersion': 'Select version',
    'publish.selectEnv': 'Select environment',
    'publish.env.dev': 'dev',
    'publish.env.test': 'test',
    'publish.env.prod': 'prod',
    'publish.confirm': 'Publish version {version} to {env}?',
    'publish.publishing': 'Publishing...',
    'publish.success': 'Published successfully!',
    'publish.previewUrl': 'Preview URL',
    'publish.failed': 'Publish failed',
    'publish.noVersions': 'No versions found, please deploy first',

    // Setup
    'setup.noProject': 'No project linked',
    'setup.runHint': 'Run',
    'setup.runOr': 'or',
    'setup.runGetStarted': 'to get started',

    // Link
    'link.title': 'Link App',
    'link.description': 'Associate this directory with an existing app',
    'link.tabToSearch': 'Tab to search',

    // Dashboard extras
    'dashboard.notPublished': 'not published',
    'dashboard.botNotConnected': 'not connected',
    'dashboard.botRegisterHint': '→ Bot settings to register',

    // App List
    'list.title': 'App List',
    'list.loading': 'Loading apps...',
    'list.empty': 'No apps found. Run "portex new" to create one.',
    'list.noResults': 'No apps match your search',
    'list.search': 'Search',
    'list.searchHint': 'Type to search   [  prev   ]  next page',
    'list.page': 'Page {page}/{total}  ({count} results)',
    'list.headers.id': 'App ID',
    'list.headers.name': 'Name',
    'list.headers.platform': 'Platform',
    'list.headers.lastVersion': 'Last Ver',
    'list.headers.dev': 'dev',
    'list.headers.test': 'test',
    'list.headers.prod': 'prod',
    'list.headers.description': 'Description',

    // Bot
    'bot.title': 'Bot Settings',
    'bot.menu.register': 'Register Bot',
    'bot.menu.info': 'Bot Info',
    'bot.menu.message': 'Bot Messages',
    'bot.menu.menuButton': 'Set Menu Button',
    'bot.menu.back': '← Back',
    'bot.register.token': 'Bot Token',
    'bot.register.registering': 'Registering bot...',
    'bot.register.success': 'Bot registered successfully',
    'bot.register.failed': 'Failed to register bot',
    'bot.info.loading': 'Loading bot info...',
    'bot.info.name': 'Name',
    'bot.info.description': 'Description',
    'bot.info.shortDescription': 'Short Description',
    'bot.notBound': 'No bot bound. Use "Register Bot" first.',
    'bot.onlyTelegram': 'Bot settings are only available for Telegram apps',
    'bot.menuButton.name': 'Button name',
    'bot.menuButton.url': 'Button URL',
    'bot.menuButton.updating': 'Updating menu button...',
    'bot.menuButton.success': 'Menu button updated successfully',
    'bot.menuButton.failed': 'Failed to update menu button',

    // Config
    'config.notFound': 'No .portex config found in current directory',
    'config.created': '.portex config file created',
    'config.appName': 'App name from .portex',

    // Errors
    'error.appNotFound': "App not found. Use 'portex new' to create one.",
    'error.platformNotFound': 'Platform not found',
    'error.unauthorized': 'Not logged in. Run "portex login" first.',
    'error.forbidden': 'Access denied',
    'error.serverError': 'Server error, please try again later',
}
