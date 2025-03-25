/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/meside/warehouse",
  webpack: (config) => {
    /**
     * These packages need to be added as external, else Oracle DB will try to load them due to a
     * Webpack bug.
     *
     * See these two issues for more information:
     * - https://github.com/oracle/node-oracledb/issues/1688
     * - https://github.com/oracle/node-oracledb/issues/1691
     **/
    config.externals.push(
      ...[
        "@azure/app-configuration",
        "@azure/identity",
        "@azure/keyvault-secrets",
        "oci-common",
        "oci-objectstorage",
        "oci-secrets",
      ],
    );
    return config;
  },
  serverExternalPackages: ["oracledb"],
};

export default nextConfig;
