using Microsoft.AspNetCore.Mvc;
using ModernizationChallenge.Models;
using ModernizationChallenge.Services;

namespace ModernizationChallenge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : Controller
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var tasks = await _taskService.GetAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] TaskModel model)
        {
            var task = await _taskService.InsertAsync(model);
            return Ok(task);
        }

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromBody] TaskModel model)
        {
            var task = await _taskService.UpdateAsync(model);
            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var isSuccess = await _taskService.DeleteAsync(id);
            return Ok(isSuccess);
        }
    }
}
