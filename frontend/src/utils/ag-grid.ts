import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const agGridDarkTheme = themeQuartz.withParams({
  accentColor: "#0054FF",
  backgroundColor: "#242424",
  borderColor: "#36383B",
  borderRadius: 3,
  browserColorScheme: "dark",
  cellHorizontalPaddingScale: 1,
  chromeBackgroundColor: {
    ref: "backgroundColor",
  },
  columnBorder: true,
  fontFamily: "inherit",
  fontSize: 14,
  foregroundColor: "#C9C9C9",
  headerBackgroundColor: "#242424",
  headerFontSize: 14,
  headerFontWeight: 500,
  headerTextColor: "#FFFFFF",
  headerVerticalPaddingScale: 0.9,
  iconSize: 12,
  oddRowBackgroundColor: "#242424",
  rowBorder: true,
  rowVerticalPaddingScale: 1,
  sidePanelBorder: false,
  spacing: 4,
  wrapperBorder: true,
  wrapperBorderRadius: 8,
});
