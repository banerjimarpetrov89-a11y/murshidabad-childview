declare module "*.geojson?raw" {
  const content: string;
  export default content;
}
declare module "*.geojson" {
  const value: any;
  export default value;
}
