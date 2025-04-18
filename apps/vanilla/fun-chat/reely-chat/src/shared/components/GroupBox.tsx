interface Props<T> {
  caption: string;
  styles?: Partial<CSSStyleDeclaration>;
  className?: string;
  children?: T[];
}
export const GroupBox = <T,>({ caption = '', className = '', children = [], ...rest }: Props<T>) => {
  return (
    <fieldset class={className} {...rest}>
      <legend>{caption}</legend>
      {children}
      {/*<div class="field-row">*/}
      {/*  <input id="radio8" type="radio" name="fieldset-example2" />*/}
      {/*  <label for="radio8">Claire Saffitz</label>*/}
      {/*</div>*/}
      {/*<div class="field-row">*/}
      {/*  <input id="radio9" type="radio" name="fieldset-example2" />*/}
      {/*  <label for="radio9">Brad Leone</label>*/}
      {/*</div>*/}
      {/*<div class="field-row">*/}
      {/*  <input id="radio10" type="radio" name="fieldset-example2" />*/}
      {/*  <label for="radio10">Chris Morocco</label>*/}
      {/*</div>*/}
      {/*<div class="field-row">*/}
      {/*  <input id="radio11" type="radio" name="fieldset-example2" />*/}
      {/*  <label for="radio11">Carla Lalli Music</label>*/}
      {/*</div>*/}
    </fieldset>
  );
};
