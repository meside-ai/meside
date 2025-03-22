export default function AgentSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Agent Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI agents and their behaviors
        </p>
      </div>
      <div className="divide-y divide-border rounded-md border">
        <div className="p-4">
          <h4 className="text-sm font-medium mb-2">Agent Configuration</h4>
          <div className="space-y-4">
            {/* Add agent configuration form here */}
            <p className="text-sm text-muted-foreground">
              Manage your AI agents, their roles, and capabilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
