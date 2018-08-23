export default class Lance {
    static Trace = class {
        /**
         * Include all trace levels.
         * @memberof Trace
         * @member {Number} TRACE_ALL
         */
        static get TRACE_ALL() {
            return 0;
        }

        /**
         * Include debug traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_DEBUG
         */
        static get TRACE_DEBUG() {
            return 1;
        }

        /**
         * Include info traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_INFO
         */
        static get TRACE_INFO() {
            return 2;
        }

        /**
         * Include warn traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_WARN
         */
        static get TRACE_WARN() {
            return 3;
        }

        /**
         * Include error traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_ERROR
         */
        static get TRACE_ERROR() {
            return 4;
        }

        /**
         * Disable all tracing.
         * @memberof Trace
         * @member {Number} TRACE_NONE
         */
        static get TRACE_NONE() {
            return 1000;
        }
    }
}
