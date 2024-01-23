import React, { useContext, useEffect, useState } from 'react';
import { useSpring, config, animated } from 'react-spring';
import useHeight from '@/_hooks/use-height-transition';
import { computeCoercion, getCurrentNodeType, resolveReferences } from './utils';
import { EditorContext } from '../Context/EditorContextWrapper';
import NewCodeHinter from '.';
import { copyToClipboard } from '@/_helpers/appUtils';
import { Alert } from '@/_ui/Alert/Alert';

export const PreviewBox = ({ currentValue, isFocused, validatinSchema, setErrorStateActive, componentId }) => {
  // Todo: |isWorkspaceVariable| Remove this when workspace variables are deprecated
  const isWorkspaceVariable =
    typeof currentValue === 'string' && (currentValue.includes('%%client') || currentValue.includes('%%server'));

  const { variablesExposedForPreview } = useContext(EditorContext);

  const customVariables = variablesExposedForPreview?.[componentId] ?? {};

  const [resolvedValue, setResolvedValue] = useState('');
  const [error, setError] = useState(null);
  const [coersionData, setCoersionData] = useState(null);

  const [heightRef, currentHeight] = useHeight();
  const darkMode = localStorage.getItem('darkMode') === 'true';

  const themeCls = darkMode ? 'bg-dark  py-1' : 'bg-light  py-1';

  const getPreviewContent = (content) => {
    if (!content) return currentValue;

    const type = typeof content;
    try {
      switch (type) {
        case 'object':
          return JSON.stringify(content);
        case 'boolean':
          return content.toString();
        default:
          return content;
      }
    } catch (e) {
      return undefined;
    }
  };

  const slideInStyles = useSpring({
    config: { ...config.stiff },
    from: { opacity: 0, height: 0 },
    to: {
      opacity: isFocused ? 1 : 0,
      height: isFocused ? currentHeight + (isWorkspaceVariable ? 30 : 0) : 0,
    },
  });

  let previewType = getCurrentNodeType(resolvedValue);
  let previewContent = resolvedValue;

  const content = getPreviewContent(previewContent);

  useEffect(() => {
    if (error) {
      setErrorStateActive(true);
    } else {
      setErrorStateActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const [valid, error, newValue, resolvedValue] = resolveReferences(currentValue, validatinSchema, customVariables);
    const [coercionPreview, typeAfterCoercion, typeBeforeCoercion] = computeCoercion(resolvedValue, newValue);

    if (!validatinSchema) {
      return setResolvedValue(newValue);
    }

    if (valid) {
      setResolvedValue(resolvedValue);

      setCoersionData({
        coercionPreview,
        typeAfterCoercion,
        typeBeforeCoercion,
      });
      setError(null);
    } else {
      setError(error);
      setCoersionData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  return (
    <animated.div className={isFocused ? themeCls : null} style={{ ...slideInStyles, overflow: 'hidden' }}>
      <div ref={heightRef} className={`dynamic-variable-preview px-1 py-1 ${!error ? 'bg-green-lt' : 'bg-red-lt'}`}>
        {!error ? (
          <RenderResolvedValue
            previewType={previewType}
            resolvedValue={content}
            coersionData={coersionData}
            isFocused={isFocused}
          />
        ) : (
          <RenderError error={error} />
        )}
      </div>
      {isWorkspaceVariable && <DepericatedAlertForWorkspaceVariable text={'Deprecating soon'} />}
    </animated.div>
  );
};

const RenderResolvedValue = ({ previewType, resolvedValue, coersionData, isFocused }) => {
  const previewValueType =
    coersionData && coersionData?.typeBeforeCoercion
      ? `${coersionData?.typeBeforeCoercion} ${
          coersionData?.coercionPreview ? ` → ${coersionData?.typeAfterCoercion}` : ''
        }`
      : previewType;

  return (
    <div className="dynamic-variable-preview-content" style={{ whiteSpace: 'pre-wrap' }}>
      <div className="d-flex my-1">
        <div className="flex-grow-1" style={{ fontWeight: 700, textTransform: 'capitalize' }}>
          {previewValueType}
        </div>
        {isFocused && (
          <div className="preview-icons position-relative">
            <NewCodeHinter.PopupIcon
              callback={() => {
                copyToClipboard(resolvedValue);
              }}
              icon="copy"
              tip="Copy to clipboard"
            />
          </div>
        )}
      </div>
      {resolvedValue + coersionData?.coercionPreview}
    </div>
  );
};

const RenderError = ({ error }) => {
  return (
    <div>
      <div className="heading my-1">
        <span>{JSON.stringify(error)}</span>
      </div>
    </div>
  );
};

const DepericatedAlertForWorkspaceVariable = ({ text }) => {
  return (
    <Alert
      svg="tj-info-warning"
      cls="codehinter workspace-variables-alert-banner p-1 mb-0"
      data-cy={``}
      imgHeight={18}
      imgWidth={18}
    >
      <div className="d-flex align-items-center">
        <div class="">{text}</div>
      </div>
    </Alert>
  );
};
