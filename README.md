# Parallel State

Useful for running a state container in a worker, so UI thread is not too burdened.
Follows a unique state container model.

```shell
npm i -S parallel-state
```


```jsx
import React, { useEffect, useState } from 'react';
import state, { useStateController } from 'parallel-state';

function MyApp() {
  const controller = useStateController<string>('property');
  const [lol, setLol] = useState<number>();
  useEffect(() => {
      controller.add({"hola" : "spanish"}, (dispatchedValue, err) => {
      if (err) {
        throw err;
      }
      console.log(dispatchedValue);
    });
    
  }, [lol]);

  return </>;
}

```