import { useContext, useEffect } from 'react';
import { MapContext } from '../contexts';


export default function Lazy({ lazy }) {
    const { setLazy } = useContext(MapContext);

    useEffect(() => {
        setLazy(lazy)
    }, [lazy]);

    return null;
}