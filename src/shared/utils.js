export const MessageResponse = (error, response) => {
  return {
    error: error,
    response: response
  }
};

export function reflect(promise){
  return promise.then(function(v){ return {data:v, error: false }},
      function(e){ return {data:e, error: true }});
}
