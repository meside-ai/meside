import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const agGridDarkTheme = themeQuartz.withParams({
  accentColor: "#064DB9",
  borderColor: "#d2c9c6",
  borderRadius: 0,
  browserColorScheme: "light",
  cellHorizontalPaddingScale: 1,
  chromeBackgroundColor: {
    ref: "backgroundColor",
  },
  columnBorder: true,
  fontFamily: "inherit",
  fontSize: 13,
  foregroundColor: "#593F2B",
  headerBackgroundColor: "#FAD0A3",
  headerFontFamily: "inherit",
  headerFontSize: 14,
  headerFontWeight: 600,
  headerTextColor: "#4C3F35",
  headerVerticalPaddingScale: 1,
  iconSize: 13,
  rowBorder: true,
  rowVerticalPaddingScale: 1,
  sidePanelBorder: true,
  spacing: 5,
  wrapperBorder: true,
  wrapperBorderRadius: 8,
});
