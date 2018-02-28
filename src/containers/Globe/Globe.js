import { connect } from 'react-redux';
import { withCanvas } from '../../helpers/Canvas';
import { MapNavigation } from '../../helpers/MapNavigation';
import Globe from '../../components/Globe/Globe';
import { changeRotation, changePosition, resetProjection } from '../../actions/map';

const mapStateToProps = ({ map, data }) => ({
  projectionType: map.projectionType,
  mapType: map.mapType,
  scale: map.scale,
  rotation: map.rotation,
  translate: map.translate,
  topoJSON: data,
});
const mapDispatchToProps = dispatch => ({
  changePosition: translate => dispatch(changePosition(translate)),
  changeRotation: rotation => dispatch(changeRotation(rotation)),
  resetProjection: baseTranslate => dispatch(resetProjection(baseTranslate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withCanvas(MapNavigation(Globe)));
