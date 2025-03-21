export default function ToolsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tools Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure and manage your available tools
        </p>
      </div>
      <div className="divide-y divide-border rounded-md border">
        <div className="p-4">
          <h4 className="text-sm font-medium mb-2">Tools Configuration</h4>
          <div className="space-y-4">
            {/* Add tools configuration form here */}
            <p className="text-sm text-muted-foreground">
              Manage your tools, integrations, and their settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
