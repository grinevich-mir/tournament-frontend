import sanity from '@/sanity';
import blocksToHtml from '@sanity/block-content-to-html';

// const { h } = blocksToHtml;

// const defaultSerializers = {
//   types: {
//     code: (props) => h('pre', { className: props.node.language }, h('code', props.node.code)),
//   },
// };

export default (blocks, serializers = null) => blocksToHtml({
  dataset: sanity.clientConfig.dataset,
  projectId: sanity.clientConfig.projectId,
  serializers,
  blocks,
});
