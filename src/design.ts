import p5, {
  Renderer,
} from 'p5';
import { p5SVG } from 'p5-svg';

export const design = (p5: p5SVG) => {
  const houseFactor: number = 500;
  const dryWallWidth: number = 0.0125;
  const dryWallWidthFactorized: number = dryWallWidth * houseFactor;

  let jabutiObject: p5.Geometry;
  let jabutiTexture: p5.Image;

  let houseWidthSlider: p5.Element;
  let houseHeightSlider: p5.Element;
  let houseDepthSlider: p5.Element;
  let houseGapSlider: p5.Element;

  let houseWidth: number;
  let houseHeight: number;
  let houseDepth: number;
  let dryWallGap: number;

  let houseWidthFactorized: number;
  let houseHeightFactorized: number;
  let houseDepthFactorized: number;
  let dryWallGapFactorized: number;

  let houseInnerFloorCeillingArea: p5.Element;
  let houseInnerLeftRightWallArea: p5.Element;
  let houseInnerBackFrontWallArea: p5.Element;
  let houseInnerTotalArea: p5.Element;

  let houseOutterFloorCeillingArea: p5.Element;
  let houseOutterLeftRightWallArea: p5.Element;
  let houseOutterBackFrontWallArea: p5.Element;
  let houseOutterTotalArea: p5.Element;

  let houseTotalArea: p5.Element;

  let houseInnerVolume: p5.Element;
  let houseInnerWithWallsVolume: p5.Element;
  let houseGapVolume: p5.Element;
  let houseGapWithInnerVolume: p5.Element;
  let houseOutterVolume: p5.Element;

  let jabutiVisibility: p5.Element;
  let houseInnerWallsVisibility: p5.Element;
  let houseOutterWallsVisibility: p5.Element;

  const updateHouseSize = () => {
    // X
    houseWidth = houseWidthSlider.value() as number;
    houseWidthFactorized = houseWidth * houseFactor;

    // Y
    houseHeight = houseHeightSlider.value() as number;
    houseHeightFactorized = houseHeight * houseFactor;

    // Z
    houseDepth = houseDepthSlider.value() as number;
    houseDepthFactorized = houseDepth * houseFactor;

    // Dry wall gap
    dryWallGap = houseGapSlider.value() as number;
    dryWallGapFactorized = dryWallGap * houseFactor;
  }

  const calculateAreas = () => {
    // Inner
    const innerFloorCeillingArea: number = (houseWidth + dryWallWidth * 2) * houseDepth;

    houseInnerFloorCeillingArea.html(`${innerFloorCeillingArea.toFixed(6)}m²`);

    const innerLeftRightWallArea: number = houseHeight * houseDepth;

    houseInnerLeftRightWallArea.html(`${innerLeftRightWallArea.toFixed(6)}m²`);

    const innerBackFrontWallArea: number = (houseWidth + dryWallWidth * 2) * (houseHeight + dryWallWidth * 2);

    houseInnerBackFrontWallArea.html(`${innerBackFrontWallArea.toFixed(6)}m²`);

    const innerTotalArea: number = (innerFloorCeillingArea + innerLeftRightWallArea + innerBackFrontWallArea) * 2;

    houseInnerTotalArea.html(`${innerTotalArea.toFixed(6)}m²`);

    // Outter
    const outterFloorCeillingArea: number = (houseWidth + dryWallWidth * 2 + dryWallGap * 2 + dryWallWidth * 2) * (houseDepth + dryWallWidth * 2 + dryWallGap * 2);

    houseOutterFloorCeillingArea.html(`${outterFloorCeillingArea.toFixed(6)}m²`);

    const outterLeftRightWallArea: number = (houseHeight + dryWallWidth * 2 + dryWallGap * 2) * (houseDepth + dryWallWidth * 2 + dryWallGap * 2);

    houseOutterLeftRightWallArea.html(`${outterLeftRightWallArea.toFixed(6)}m²`);

    const outterBackFrontWallArea: number = (houseWidth + dryWallWidth * 2 + dryWallGap * 2 + dryWallWidth * 2) * (houseHeight + dryWallWidth * 2 + dryWallGap * 2 + dryWallWidth * 2);

    houseOutterBackFrontWallArea.html(`${outterBackFrontWallArea.toFixed(6)}m²`);

    const outterTotalArea: number = (outterFloorCeillingArea + outterLeftRightWallArea + outterBackFrontWallArea) * 2;

    houseOutterTotalArea.html(`${outterTotalArea.toFixed(6)}m²`);

    // Total
    const totalArea: number = innerTotalArea + outterTotalArea;

    houseTotalArea.html(`${totalArea.toFixed(6)}m²`);
  };

  const calculateVolumes = () => {
    // Inner
    const innerVolume: number = houseWidth * houseHeight * houseDepth;

    houseInnerVolume.html(`${innerVolume.toFixed(4)}m³ / ${(innerVolume * 1000).toFixed(3)}L`);

    const innerWithWallsVolume: number = (houseWidth + dryWallWidth * 2) * (houseHeight + dryWallWidth * 2) * (houseDepth + dryWallWidth * 2);

    houseInnerWithWallsVolume.html(`${innerWithWallsVolume.toFixed(6)}m³ / ${(innerWithWallsVolume * 1000).toFixed(3)}L`);

    // Gap
    const gapOnlyVolume: number =
      // Left/right
      dryWallGap * (houseHeight + dryWallWidth * 2) * (houseDepth + dryWallWidth * 2) * 2 +
      // Ceil/floor
      dryWallGap * (houseWidth + dryWallWidth * 2 + dryWallGap * 2) * (houseDepth + dryWallWidth * 2) * 2 +
      // Back/front
      dryWallGap * (houseWidth + dryWallWidth * 2 + dryWallGap * 2) * (houseHeight + dryWallWidth * 2 + dryWallGap * 2) * 2;

    houseGapVolume.html(`${gapOnlyVolume.toFixed(6)}m³ / ${(gapOnlyVolume * 1000).toFixed(3)}L`);

    const gapWithInnerVolume: number =
      (houseWidth + dryWallWidth * 2 + dryWallGap * 2) *
      (houseHeight + dryWallWidth * 2 + dryWallGap * 2) *
      (houseDepth + dryWallWidth * 2 + dryWallGap * 2);

    houseGapWithInnerVolume.html(`${gapWithInnerVolume.toFixed(6)}m³ / ${(gapWithInnerVolume * 1000).toFixed(3)}L`);

    // Outter
    const outterVolume: number =
      (houseWidth + dryWallWidth * 2 + dryWallGap * 2 + dryWallWidth * 2) *
      (houseHeight + dryWallWidth * 2 + dryWallGap * 2 + dryWallWidth * 2) *
      (houseDepth + dryWallWidth * 2 + dryWallGap * 2 + dryWallWidth * 2);

    houseOutterVolume.html(`${outterVolume.toFixed(6)}m³ / ${(outterVolume * 1000).toFixed(3)}L`);
  };

  const houseSizeChange = () => {
    updateHouseSize();
    calculateAreas();
    calculateVolumes();
  };

  p5.preload = () => {
    jabutiObject = p5.loadModel('/objects/13103_pearlturtle_v1_l2.obj', true);
    jabutiTexture = p5.loadImage('/objects/13103_pearlturtle_diffuse.jpg');
  };

  p5.setup = () => {
    p5.createCanvas(800, 600, p5.WEBGL) as unknown as Renderer;

    // Use degrees instead of radians
    p5.angleMode(p5.DEGREES);

    // Panels' holder
    const panelsDiv: p5.Element = p5.createDiv();

    panelsDiv.addClass('panel');

    // House size panel
    const houseSizePanel: p5.Element = p5.createDiv();

    houseSizePanel.addClass('house-size');

    houseSizePanel.child(p5.createP('Sizes').addClass('title'));

    houseSizePanel.child(p5.createP('Inner width:').addClass('margin-top'));
    houseWidthSlider = p5.createSlider(0.25, 2, 0.25, 0.05);
    houseWidthSlider.elt.addEventListener('input', houseSizeChange);
    houseSizePanel.child(houseWidthSlider);

    houseSizePanel.child(p5.createP('Inner height:').addClass('margin-top'));
    houseHeightSlider = p5.createSlider(0.25, 2, 0.25, 0.05);
    houseHeightSlider.elt.addEventListener('input', houseSizeChange);
    houseSizePanel.child(houseHeightSlider);

    houseSizePanel.child(p5.createP('Inner depth:').addClass('margin-top'));
    houseDepthSlider = p5.createSlider(0.5, 2, 0.5, 0.05);
    houseDepthSlider.elt.addEventListener('input', houseSizeChange);
    houseSizePanel.child(houseDepthSlider);

    houseSizePanel.child(p5.createP('Gap:').addClass('margin-top'));
    houseGapSlider = p5.createSlider(0.01, 0.1, 0.045, 0.005);
    houseGapSlider.elt.addEventListener('input', houseSizeChange);
    houseSizePanel.child(houseGapSlider);

    panelsDiv.child(houseSizePanel);

    // Inner areas info panel
    const houseInnerAreasPanel: p5.Element = p5.createDiv();

    houseInnerAreasPanel.child(p5.createP('Inner areas').addClass('title'));

    houseInnerAreasPanel.child(p5.createP('Floor/ceilling area:').addClass('margin-top'));
    houseInnerFloorCeillingArea = p5.createP('-');
    houseInnerAreasPanel.child(houseInnerFloorCeillingArea);

    houseInnerAreasPanel.child(p5.createP('Left/right area:').addClass('margin-top'));
    houseInnerLeftRightWallArea = p5.createP('-');
    houseInnerAreasPanel.child(houseInnerLeftRightWallArea);

    houseInnerAreasPanel.child(p5.createP('Back/front area:').addClass('margin-top'));
    houseInnerBackFrontWallArea = p5.createP('-');
    houseInnerAreasPanel.child(houseInnerBackFrontWallArea);

    houseInnerAreasPanel.child(p5.createP('Total area:').addClass('margin-top'));
    houseInnerTotalArea = p5.createP('-');
    houseInnerAreasPanel.child(houseInnerTotalArea);

    panelsDiv.child(houseInnerAreasPanel);

    // Outter areas info panel
    const houseOutterAreasPanel: p5.Element = p5.createDiv();

    houseOutterAreasPanel.child(p5.createP('Outter areas').addClass('title'));

    houseOutterAreasPanel.child(p5.createP('Floor/ceilling area:').addClass('margin-top'));
    houseOutterFloorCeillingArea = p5.createP('-');
    houseOutterAreasPanel.child(houseOutterFloorCeillingArea);

    houseOutterAreasPanel.child(p5.createP('Left/right area:').addClass('margin-top'));
    houseOutterLeftRightWallArea = p5.createP('-');
    houseOutterAreasPanel.child(houseOutterLeftRightWallArea);

    houseOutterAreasPanel.child(p5.createP('Back/front area:').addClass('margin-top'));
    houseOutterBackFrontWallArea = p5.createP('-');
    houseOutterAreasPanel.child(houseOutterBackFrontWallArea);

    houseOutterAreasPanel.child(p5.createP('Total area:').addClass('margin-top'));
    houseOutterTotalArea = p5.createP('-');
    houseOutterAreasPanel.child(houseOutterTotalArea);

    panelsDiv.child(houseOutterAreasPanel);

    // Total area / visibility panel
    const totalAreaAndVisibilityPanel: p5.Element = p5.createDiv();

    totalAreaAndVisibilityPanel.child(p5.createP('Total area').addClass('title'));

    houseTotalArea = p5.createP('-').addClass('margin-top');
    totalAreaAndVisibilityPanel.child(houseTotalArea);

    totalAreaAndVisibilityPanel.child(p5.createP('Visibility').addClass('title').addClass('margin-top'));

    jabutiVisibility = p5.createCheckbox(' Jabuti', true).addClass('margin-top');
    totalAreaAndVisibilityPanel.child(jabutiVisibility);

    houseInnerWallsVisibility = p5.createCheckbox(' Inner walls', true);
    totalAreaAndVisibilityPanel.child(houseInnerWallsVisibility);

    houseOutterWallsVisibility = p5.createCheckbox(' Outter walls', true);
    totalAreaAndVisibilityPanel.child(houseOutterWallsVisibility);

    panelsDiv.child(totalAreaAndVisibilityPanel);

    // Volume info panel
    const houseVolumesPanel: p5.Element = p5.createDiv();

    houseVolumesPanel.child(p5.createP('Volumes').addClass('title'));

    houseVolumesPanel.child(p5.createP('Inner volume:').addClass('margin-top'));
    houseInnerVolume = p5.createP('-');
    houseVolumesPanel.child(houseInnerVolume);

    houseVolumesPanel.child(p5.createP('Inner with walls volume:').addClass('margin-top'));
    houseInnerWithWallsVolume = p5.createP('-');
    houseVolumesPanel.child(houseInnerWithWallsVolume);

    houseVolumesPanel.child(p5.createP('Gap only volume:').addClass('margin-top'));
    houseGapVolume = p5.createP('-');
    houseVolumesPanel.child(houseGapVolume);

    houseVolumesPanel.child(p5.createP('Gap with inner volume:').addClass('margin-top'));
    houseGapWithInnerVolume = p5.createP('-');
    houseVolumesPanel.child(houseGapWithInnerVolume);

    houseVolumesPanel.child(p5.createP('Outter volume:').addClass('margin-top'));
    houseOutterVolume = p5.createP('-');
    houseVolumesPanel.child(houseOutterVolume);

    panelsDiv.child(houseVolumesPanel);

    // Update size variables
    updateHouseSize();

    // Calculate initial areas
    calculateAreas();

    // Calculate initial volumes
    calculateVolumes();
  };

  p5.draw = () => {
    p5.background(30);

    // Update camera
    p5.orbitControl(2, 2, 2);

    // Jabuti
    if ((jabutiVisibility as any).checked() === true) {
      p5.push();
        p5.noStroke();
        p5.scale(1.15, 1.5, 1.25);
        p5.rotateX(-90);
        p5.rotateY(180);
        p5.texture(jabutiTexture);
        p5.model(jabutiObject);
      p5.pop();
    }

    // Inner house
    if ((houseInnerWallsVisibility as any).checked() === true) {
      p5.fill(255, 255, 255, 128);

      // Floor
      p5.push();
        p5.translate(0, (houseHeightFactorized + dryWallWidthFactorized) * 0.5 , 0);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2, dryWallWidthFactorized, houseDepthFactorized);
      p5.pop();

      // Left wall
      p5.push();
        p5.translate(-(houseWidthFactorized + dryWallWidthFactorized) * 0.5, 0, 0);
        p5.box(dryWallWidthFactorized, houseHeightFactorized, houseDepthFactorized);
      p5.pop();

      // Right wall
      p5.push();
        p5.translate((houseWidthFactorized + dryWallWidthFactorized) * 0.5, 0, 0);
        p5.box(dryWallWidthFactorized, houseHeightFactorized, houseDepthFactorized);
      p5.pop();

      // Ceilling
      p5.push();
        p5.translate(0, -(houseHeightFactorized + dryWallWidthFactorized) * 0.5 , 0);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2, dryWallWidthFactorized, houseDepthFactorized);
      p5.pop();

      // Back wall
      p5.push();
        p5.translate(0, 0, -(houseDepthFactorized + dryWallWidthFactorized) * 0.5);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2, houseHeightFactorized + dryWallWidthFactorized * 2, dryWallWidthFactorized);
      p5.pop();

      // Front wall
      p5.push();
        p5.translate(0, 0, (houseDepthFactorized + dryWallWidthFactorized) * 0.5);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2, houseHeightFactorized + dryWallWidthFactorized * 2, dryWallWidthFactorized);
      p5.pop();
    }

    // Outter house
    if ((houseOutterWallsVisibility as any).checked() === true) {
      p5.fill(0, 192, 0, 128);

      // Floor
      p5.push();
        p5.translate(0, houseHeightFactorized * 0.5 + dryWallWidthFactorized + dryWallGapFactorized + dryWallWidthFactorized * 0.5, 0);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2 + dryWallWidthFactorized * 2, dryWallWidthFactorized, houseDepthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2);
      p5.pop();

      // Left wall
      p5.push();
        p5.translate(-(houseWidthFactorized * 0.5 + dryWallWidthFactorized + dryWallGapFactorized + dryWallWidthFactorized * 0.5), 0, 0);
        p5.box(dryWallWidthFactorized, houseHeightFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2, houseDepthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2);
      p5.pop();

      // Right wall
      p5.push();
        p5.translate(houseWidthFactorized * 0.5 + dryWallWidthFactorized + dryWallGapFactorized + dryWallWidthFactorized * 0.5, 0, 0);
        p5.box(dryWallWidthFactorized, houseHeightFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2, houseDepthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2);
      p5.pop();

      // Ceilling
      p5.push();
        p5.translate(0, -(houseHeightFactorized * 0.5 + dryWallWidthFactorized + dryWallGapFactorized + dryWallWidthFactorized * 0.5), 0);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2 + dryWallWidthFactorized * 2, dryWallWidthFactorized, houseDepthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2);
      p5.pop();

      // Back wall
      p5.push();
        p5.translate(0, 0, -(houseDepthFactorized * 0.5 + dryWallWidthFactorized + dryWallGapFactorized + dryWallWidthFactorized * 0.5));
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2 + dryWallWidthFactorized * 2, houseHeightFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2 + dryWallWidthFactorized * 2, dryWallWidthFactorized);
      p5.pop();

      // Front wall
      p5.push();
        p5.translate(0, 0, houseDepthFactorized * 0.5 + dryWallWidthFactorized + dryWallGapFactorized + dryWallWidthFactorized * 0.5);
        p5.box(houseWidthFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2 + dryWallWidthFactorized * 2, houseHeightFactorized + dryWallWidthFactorized * 2 + dryWallGapFactorized * 2 + dryWallWidthFactorized * 2, dryWallWidthFactorized);
      p5.pop();
    }
  };
};
