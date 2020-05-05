using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        
        public RestException(HttpStatusCode code, object erros = null)
        {
            Code = code;
            Erros = erros;
        }

        public HttpStatusCode Code { get; }
        public object Erros { get; }
    }
}