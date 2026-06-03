import { useState, useActionState, use } from 'react';

function reducerAction(prevState, action)
{
    switch (action.type)
    {
        case 'increment':
            return prevState + 1;
        case 'decrement':
            return prevState - 1;
        case 'reset':
            return 0;
        case 'set':
            return action.payload;
    }
    return null;
}


let promiseCache = null;
function Counter()
{
    const [count, setCount] = useState(0);
    const [state, dispatchAction, isPending] = useActionState(reducerAction, null);

    // if (!promiseCache.has(count))
    // {
    //     promiseCache.set(count, new Promise(
    //         resolve => setTimeout(() => resolve({ initialCount: 0 }), 1000)
    //     ));
    // }
    if (promiseCache === null)
    {
        promiseCache = new Promise(
            resolve => setTimeout(() => resolve(count), 1000)
        );
    }

    // const data = use(promiseCache.get(count));
    let data = use(promiseCache);

    promiseCache = null;
    data = null;

    return (
        <div className="no-select">


            <div>
                <h1>
                    Count is {count}
                </h1>
            </div>



            <button
                type="button"
                className="counter"
                onClick={
                    () =>
                    {
                        setCount((c) => c + 1);
                    }
                }>
                Click here
            </button>


        </div>
    );
}


export default Counter